// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
// u/nixxen - Early start improvements, reasonable console prints, more risky probability for closer margins
/** @param {NS} ns **/
export async function main(ns) {
	let maxSharePer = 1.0;
	let stockBuyPer = 0.55; // 55% - Adjust higher to play it safer. Used in combination with stock volatility.
	let stockSellLimit = 0.5; // Will be used in combination with stock volatility
	let stockVolPer = 0.05;
	let moneyKeep = 1 * 10 ** 9; // 1b - Adjust this lower if you do not have enough yet (or higher if you want more spare money)
	let minSharePerPurchase = 5;
	let formatString = "$0.000a";
	let commissionFee = 100 * 10 ** 3; // 100k
	let cumulativeCommisionFee = 0;
	let commissionFeeFile = "commissionTotal.txt";
	if (ns.fileExists(commissionFeeFile)) {
		let data = await ns.read(commissionFeeFile);
		if (isNaN(parseInt(data))) {
			ns.rm(commissionFeeFile);
			ns.print(
				`Warning - Corrupt data in ${commissionFeeFile}. Deleting file as starting fresh.`
			);
		} else {
			cumulativeCommisionFee = parseInt(data);
			ns.print(
				`Info - Loaded previously saved commission data, ${ns.nFormat(
					cumulativeCommisionFee,
					formatString
				)}, from ${commissionFeeFile}. To start from zero, delete the file and restart the script.`
			);
		}
	}
	let minBuyCost = commissionFee * 10 * 100; // 100m - Increase this to reduce the buy spam when bottomed out at moneyKeep early game.
	let tooMuchMoney = false;

	while (true) {
		let changes = false;
		ns.disableLog("disableLog");
		ns.disableLog("sleep");
		ns.disableLog("getServerMoneyAvailable");
		let stocks = ns.stock.getSymbols().sort(function (a, b) {
			return ns.stock.getForecast(b) - ns.stock.getForecast(a);
		});
		for (const stock of stocks) {
			var position = ns.stock.getPosition(stock);
			if (position[0]) {
				//ns.print('Position: ' + stock + ', ')
				changes = (await sellPositions(stock)) || changes;
			}
			changes = (await buyPositions(stock)) || changes;
			// ns.print("Changes: " + changes)
		}
		if (!changes) {
			let playerMoney = ns.getServerMoneyAvailable("home");
			let percentageMissing =
				((playerMoney - moneyKeep) / minBuyCost) * 100;
			if (percentageMissing < 100) {
				ns.print(
					`Cycle complete, insufficient money to offset commision fee. Accumulating money: ${percentageMissing.toFixed(
						2
					)}% of ${ns.nFormat(minBuyCost, formatString)}`
				);
				tooMuchMoney = false;
			} else if (!tooMuchMoney) {
				ns.print(
					"Cycle complete, enough money, but no more viable stocks to buy. Squelching logs while awaiting stock changes..."
				);
				tooMuchMoney = !tooMuchMoney;
			}
		} else {
			ns.print("Cycle Complete after interaction with stock market");
			tooMuchMoney = false;
		}
		await ns.sleep(6000);
	}

	async function buyPositions(stock) {
		let changes = false;
		let maxShares =
			ns.stock.getMaxShares(stock) * maxSharePer - position[0];
		let askPrice = ns.stock.getAskPrice(stock);
		let forecast = ns.stock.getForecast(stock);
		let volPer = ns.stock.getVolatility(stock);
		if (forecast >= stockBuyPer + volPer && volPer <= stockVolPer) {
			let playerMoney = ns.getServerMoneyAvailable("home");
			let shares = Math.max(
				Math.min(
					(playerMoney - moneyKeep - commissionFee) / askPrice,
					maxShares
				),
				minSharePerPurchase
			);
			let currentMinBuyPrice = ns.stock.getPurchaseCost(
				stock,
				shares,
				"Long"
			);
			if (
				playerMoney - moneyKeep > currentMinBuyPrice &&
				currentMinBuyPrice > minBuyCost
			) {
				changes = true;
				ns.stock.buy(stock, shares);
				await updateCommissionTotal();
			}
		}
		return changes;
	}

	async function updateCommissionTotal() {
		cumulativeCommisionFee += commissionFee;
		await ns.write(commissionFeeFile, cumulativeCommisionFee, "w");
		ns.print(
			`Info - Total commission fees: ${ns.nFormat(
				cumulativeCommisionFee,
				formatString
			)}`
		);
	}

	async function sellPositions(stock) {
		let changes = false;
		let forecast = ns.stock.getForecast(stock);
		let volPer = ns.stock.getVolatility(stock);
		if (forecast < stockSellLimit + volPer) {
			changes = true;
			let tempPosition = parseInt(position[0]);
			let gains = parseInt(position[1]);
			let sellPrice = ns.stock.sell(stock, position[0]);
			await updateCommissionTotal();
			let profit = Math.floor((sellPrice - gains) * tempPosition);
			let returns = Math.floor(sellPrice * tempPosition);
			ns.tprint(
				`Sold: ${stock} with a profit of ${ns.nFormat(
					profit,
					formatString
				)} for a total return of ${ns.nFormat(returns, formatString)}`
			);
		}
		return changes;
	}
}
