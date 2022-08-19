/**
 * Run this when you want to bail out and extract all assets for a new augment installation.
 * Will stop any trading scripts and sell all owned stocks. Finally kills all scripts.
 * @param {NS} ns */
export async function main(ns) {
	/**
	 * @input a list of all available stock ticker symbols.
	 * @returns a list of any stock the player owns.
	 *  Each stock in the list has the following format:
	 *
	 *  {
	 *      ticker: str, (ticker symbol name)
	 *      long: str, (number of long shares)
	 *      short: str, (number of short shares)
	 *  }
	 */
	const getPlayerStocks = (...allStocks) => {
		return allStocks.reduce((previousStocks, ticker) => {
			let pos = ns.stock.getPosition(ticker);
			if (pos[0]) {
				const stockInfo = {
					ticker,
					long: pos[0],
					short: pos[2],
				};
				previousStocks.push(stockInfo);
				return previousStocks;
			} else return previousStocks;
		}, []);
	};

	/**
	 * @input a list of player owned stocks in the format from getPlayerStocks
	 * @returns the combined sell value after selling all input stocks
	 */
	const sellStocks = (...stocks) => {
		let sellValue = 0;
		stocks.forEach((stock) => {
			// ns.tprint(
			// 	`DEBUG - Selling ${stock.ticker}. Long: ${stock.long}, Short: ${stock.short}.`
			// );
			if (stock.long) {
				const value = ns.stock.sellStock(stock.ticker, stock.long);
				if (value) {
					sellValue += value;
				} else {
					ns.tprint(
						`Failed to sell long ${stock.ticker}. Try again or contact support.`
					);
				}
			}
			if (stock.short) {
				// NOTE: Shorts are not available until later bitnodes. If this
				//  bugs out in earlier bitnodes, just comment out this entire
				//  section. It SHOULD only trigger IF the player has short
				//  stocks though.
				const value = ns.stock.sellShort(stock.ticker, stock.short);
				if (value) {
					sellValue += value;
				} else {
					ns.tprint(
						`Failed to sell short ${stock.ticker}. Try again or contact support.`
					);
				}
			}
		});
		return sellValue;
	};

	const ownedStocks = getPlayerStocks(...ns.stock.getSymbols());
	// ns.tprint(`DEBUG - Owned stocks: ${JSON.stringify(ownedStocks)}`);
	const sellValue = sellStocks(...ownedStocks);

	ns.tprint(
		"Bailed out of stock market. Reclaimed " +
			ns.nFormat(sellValue, "($ 0.00 a)") +
			". Remember to spend anything that can be spent (home upgrades, extra governor augments, faction donations, others?)"
	);
	ns.killall("home");
}
