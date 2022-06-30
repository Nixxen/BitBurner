/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	var homeServ = "home";
	var pRam = 8; // purchased ram
	var servPrefix = "pserv-";

	var maxRam = ns.getPurchasedServerMaxRam();
	var maxServers = ns.getPurchasedServerLimit();

	var virus = "money-maker.js";
	var virusRam = ns.getScriptRam(virus);

	function canPurchaseServer() {
		ns.disableLog('disableLog');
		ns.disableLog('getServerMoneyAvailable');
		var playerMoney = ns.getServerMoneyAvailable(homeServ)
		var serverCost = ns.getPurchasedServerCost(pRam)
		ns.print("Awaiting player money to increase: " + ns.nFormat(playerMoney, '($ 0.00 a)') + "/" + ns.nFormat(serverCost, '($ 0.00 a)') + "(" + (playerMoney/serverCost*100).toFixed(2) + "%)");
		return playerMoney > serverCost;
	}

	function killVirus(server) {
		if (ns.scriptRunning(virus, server)) {
			ns.scriptKill(virus, server);
		}
	}

	async function copyAndRunVirus(server) {
		ns.print("Copying virus to server: " + server);
		await ns.scp(virus, server);
		killVirus(server);
		var maxThreads = Math.floor(pRam / virusRam);
		ns.exec(virus, server, maxThreads, target);
	}

	function shutdownServer(server) {
		killVirus(server); // need to stop scripts before delete
		ns.deleteServer(server);
	}

	async function upgradeServer(server) {
		var sRam = ns.getServerMaxRam(server);
		if (sRam < pRam) {
			while (!canPurchaseServer()) {
				await ns.sleep(10000);
			}
			shutdownServer(server);
			ns.purchaseServer(server, pRam);
		}
		await copyAndRunVirus(server);
	}

	async function purchaseServer(server) {
		while (!canPurchaseServer()) {
			await ns.sleep(10000);
		}
		ns.purchaseServer(server, pRam);
		await copyAndRunVirus(server);
	}

	async function autoUpgradeServers() {
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
	}

	while (true) {
		await autoUpgradeServers();
		if (pRam === maxRam) {
			ns.tprint("Upgraded all servers to maximum capacity. Closing script.")
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