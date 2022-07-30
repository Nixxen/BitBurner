/** @param {NS} ns **/
export async function main(ns) {
	// Silence log spam
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	ns.disableLog("getServerMoneyAvailable");

	const target = ns.args[0];
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
		return playerCanAfford(serverCost);
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
		ns.purchaseServer(server, pRam);
		await copyAndRunVirus(server);
	};

	const autoUpgradeServers = async () => {
		var i = 0;
		while (i < maxServers) {
			var server = servPrefix + i;
			if (ns.serverExists(server)) {
				ns.print("Upgrading server " + server + " to " + pRam + "GB");
				await upgradeServer(server);
				++i;
			} else {
				ns.print("Purchasing server " + server + " at " + pRam + "GB");
				await purchaseServer(server);
				++i;
			}
		}
	};

	while (true) {
		await autoUpgradeServers();
		if (pRam === maxRam) {
			ns.tprint(
				"Upgraded all servers to maximum capacity. Closing script."
			);
			break;
		}
		// move up to next tier
		var newRam = pRam * 2;
		if (newRam > maxRam) {
			pRam = maxRam;
		} else {
			pRam = newRam;
		}
	}
}
