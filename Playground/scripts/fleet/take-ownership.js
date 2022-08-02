/**
 * Attempts to take ownership of the targeted server.
 *  @param {NS} ns
 * @returns {boolean} true if the server was taken over
 **/
export async function takeOwnership(ns, server) {
	const homeServer = "home";
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject,
	};

	function penetrate(server) {
		ns.tprint("Penetrating " + server);
		for (let file of Object.keys(cracks)) {
			if (ns.fileExists(file, homeServer)) {
				const runScript = cracks[file];
				runScript(server);
			}
		}
	}

	function getNumCracks() {
		return Object.keys(cracks).filter(function (file) {
			return ns.fileExists(file, homeServer);
		}).length;
	}

	function canHack(server) {
		const numCracks = getNumCracks();
		const reqPorts = ns.getServerNumPortsRequired(server);
		return numCracks >= reqPorts;
	}

	async function gainAccess(server) {
		if (!ns.hasRootAccess(server)) {
			const requiredPorts = ns.getServerNumPortsRequired(server);
			if (requiredPorts > 0) {
				penetrate(server);
			}
			ns.tprint("Server penetrated. Gaining root access on " + server);
			ns.nuke(server);
		} else {
			ns.tprint("Already have root access on " + server);
		}
	}

	if (canHack(server)) {
		await gainAccess(server);
		return true;
	} else {
		ns.tprint(`Cannot hack ${server}, not enough cracks.`);
		return false;
	}
}

/** @param {NS} ns **/
export async function main(ns) {
	const server = ns.args[0];
	takeOwnership(ns, server);
}
