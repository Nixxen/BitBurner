/**
 * Attempts to take ownership of the targeted server.
 *  @param {NS} ns
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
		for (var file of Object.keys(cracks)) {
			if (ns.fileExists(file, homeServer)) {
				const runScript = cracks[file];
				runScript(server);
			}
		}
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

	await gainAccess(server);
}

/** @param {NS} ns **/
export async function main(ns) {
	var server = ns.args[0];
	takeOwnership(ns, server);
}
