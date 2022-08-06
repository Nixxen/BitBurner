/** @param {NS} ns **/
export async function main(ns) {
	// Silence log spam
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	ns.disableLog("getServerMoneyAvailable");

	const target = ns.args[0];
	if (!target) {
		ns.tprint("No target specified. Exiting.");
		return;
	}
	const purchaseLimit = parseInt(ns.args[1]) || 0; // Max price to pay for next upgrade. 0 is disabled
	const homeServ = "home";
	let pRam = 8; // purchased ram
	const servPrefix = "pserv-";
	const moneyKeepLimit = 15 * 10 ** 6; // 15m - Adjust this lower if you do not have enough yet
	const sleepAwaitTime = 10000;

	const maxRam = ns.getPurchasedServerMaxRam();
	const maxServers = ns.getPurchasedServerLimit();

	const virus = "/scripts/early/money-maker.js";
	const virusRam = ns.getScriptRam(virus);

	const playerCanAfford = (cost) => {
		return getPlayerMoney() - cost > moneyKeepLimit;
	};

	const getPlayerMoney = () => ns.getServerMoneyAvailable(homeServ);

	const isUnderPurchaseLimit = (price) => {
		return !purchaseLimit || price <= purchaseLimit;
	};

	const canPurchaseServer = () => {
		const playerMoney = getPlayerMoney();
		const serverCost = ns.getPurchasedServerCost(pRam);
		ns.print(
			`\tAwaiting player money to increase: ${ns.nFormat(
				playerMoney,
				"$0.00a"
			)}/${ns.nFormat(serverCost + moneyKeepLimit, "$0.00a")}(${(
				(playerMoney / (serverCost + moneyKeepLimit)) *
				100
			).toFixed(2)}%) (with ${ns.nFormat(
				moneyKeepLimit,
				"0.00a"
			)} offset).`
		);
		return playerCanAfford(serverCost) && isUnderPurchaseLimit(serverCost);
	};

	const killVirus = (server) => {
		if (ns.scriptRunning(virus, server)) {
			ns.scriptKill(virus, server);
		}
	};

	const copyAndRunVirus = async (server) => {
		ns.print("Copying virus to server: " + server);
		await ns.scp(virus, server);
		killVirus(server);
		var maxThreads = Math.floor(pRam / virusRam);
		ns.exec(virus, server, maxThreads, target);
	};

	const shutdownServer = (server) => {
		killVirus(server); // need to stop scripts before delete
		ns.deleteServer(server);
	};

	const upgradeServer = async (server) => {
		var sRam = ns.getServerMaxRam(server);
		if (sRam < pRam) {
			while (!canPurchaseServer()) {
				await ns.sleep(sleepAwaitTime);
			}
			shutdownServer(server);
			ns.purchaseServer(server, pRam);
		}
		await copyAndRunVirus(server);
	};

	const purchaseServer = async (server) => {
		while (!canPurchaseServer()) {
			await ns.sleep(sleepAwaitTime);
		}
		const result = ns.purchaseServer(server, pRam);
		if (!result) {
			ns.tprint(
				`Failed to purchase server: ${server} with ram/max ${pRam}/${ns.getPurchasedServerMaxRam()} and cost/player ${ns.nFormat(
					ns.getPurchasedServerCost(pRam),
					"$0.000a"
				)}/${ns.nFormat(
					getPlayerMoney(),
					"$0.000a"
				)}. Debug through the servers.js script.`
			);
		}
		await copyAndRunVirus(server);
	};

	const autoUpgradeServers = async () => {
		let i = 0;
		let cost = ns.getPurchasedServerCost(pRam);
		while (i < maxServers && isUnderPurchaseLimit(cost)) {
			let server = servPrefix + i;
			let cost = ns.getPurchasedServerCost(pRam);
			if (isUnderPurchaseLimit(cost)) {
				if (ns.serverExists(server)) {
					ns.print(
						"Upgrading server " + server + " to " + pRam + "GB"
					);
					await upgradeServer(server);
					++i;
				} else {
					ns.print(
						"Purchasing server " +
							server +
							" for " +
							ns.nFormat(cost, "$0.000a") +
							"."
					);
					await purchaseServer(server);
					++i;
				}
			}
		}
	};

	const limitText =
		purchaseLimit == 0
			? "<Unlimited>"
			: ns.nFormat(purchaseLimit, "$0.000a");
	ns.tprint(
		"Purchasing and upgrading servers named " +
			servPrefix +
			"0 to " +
			servPrefix +
			(maxServers - 1) +
			". Lower money threshold is " +
			ns.nFormat(moneyKeepLimit, "$0.000a") +
			". Upper purchase limit is " +
			limitText +
			"."
	);

	while (true) {
		await autoUpgradeServers();
		if (pRam === maxRam) {
			ns.tprint(
				"Upgraded all servers to maximum capacity. Closing script."
			);
			break;
		}
		// check if cost is too high
		const cost = ns.getPurchasedServerCost(pRam);
		if (!isUnderPurchaseLimit(cost)) {
			ns.tprint(
				`Next server purchase or upgrade is above purchase limit. Aborting script.`
			);
			break;
		} else {
			// move up to next tier
			var newRam = pRam * 2;
			if (newRam > maxRam) {
				pRam = maxRam;
			} else {
				pRam = newRam;
			}
		}
	}
}
