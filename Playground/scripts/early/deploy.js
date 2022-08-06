/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0];
	const homeServer = "home";
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject,
	};

	const payload = "/scripts/early/money-maker.js";
	const payloadCost = ns.getScriptRam(payload);

	function getNumCracks() {
		return Object.keys(cracks).filter(function (file) {
			return ns.fileExists(file, homeServer);
		}).length;
	}

	function penetrate(server) {
		ns.print("Penetrating " + server);
		for (let file of Object.keys(cracks)) {
			if (ns.fileExists(file, homeServer)) {
				const runScript = cracks[file];
				runScript(server);
			}
		}
	}

	async function copyAndDeliverPayload(server) {
		ns.print("Copying payload to server: " + server);
		await ns.scp(payload, server);

		if (!ns.hasRootAccess(server)) {
			const requiredPorts = ns.getServerNumPortsRequired(server);
			if (requiredPorts > 0) {
				penetrate(server);
			}
			ns.print("Gaining root access on " + server);
			ns.nuke(server);
		}

		if (ns.scriptRunning(payload, server)) {
			ns.scriptKill(payload, server);
		}

		const maxThreads = Math.floor(ns.getServerMaxRam(server) / payloadCost);
		ns.exec(payload, server, maxThreads, target);
	}

	// Retrieves all nodes in the network using DFS
	function getNetworkNodes() {
		ns.print("Retrieving all nodes in the network");
		let visited = {};
		let stack = [];
		const origin = ns.getHostname();
		stack.push(origin);

		while (stack.length > 0) {
			const node = stack.pop();
			if (!visited[node]) {
				visited[node] = node;
				const neighbours = ns.scan(node);
				for (let i = 0; i < neighbours.length; i++) {
					var child = neighbours[i];
					if (visited[child]) {
						continue;
					}
					stack.push(child);
				}
			}
		}
		return Object.keys(visited);
	}

	function canHack(server) {
		const numCracks = getNumCracks();
		const reqPorts = ns.getServerNumPortsRequired(server);
		const ramAvail = ns.getServerMaxRam(server);
		return numCracks >= reqPorts && ramAvail > payloadCost;
	}

	function getTargetServers() {
		const networkNodes = getNetworkNodes();
		const targets = networkNodes.filter(function (node) {
			return canHack(node) && node != homeServer;
		});
		// Add purchased servers
		let i = 0;
		const servPrefix = "pserv-";
		while (ns.serverExists(servPrefix + i)) {
			targets.push(servPrefix + i);
			++i;
		}
		return targets;
	}

	async function deployHacks(targets) {
		ns.tprint("Deploying payload to these servers " + targets);
		for (let serv of targets) {
			await copyAndDeliverPayload(serv);
		}
	}

	let curTargets = [];
	const waitTime = 2000;

	while (true) {
		const newTargets = getTargetServers();
		if (newTargets.length !== curTargets.length) {
			await deployHacks(newTargets);
			curTargets = newTargets;
		}
		await ns.sleep(waitTime);
	}
}
