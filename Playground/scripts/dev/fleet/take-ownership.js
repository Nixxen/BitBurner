/** @param {NS} ns **/
export async function main(ns) {
	var server = ns.args[0];
	var homeServer = "home";
	var cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject,
	};

	function getNumCracks() {
		return Object.keys(cracks).filter(function (file) {
			return ns.fileExists(file, homeServer);
		}).length;
	}

	function penetrate(server) {
		ns.tprint("Penetrating " + server);
		for (var file of Object.keys(cracks)) {
			if (ns.fileExists(file, homeServer)) {
				var runScript = cracks[file];
				runScript(server);
			}
		}
	}

	async function gainAccess(server) {
		if (!ns.hasRootAccess(server)) {
			var requiredPorts = ns.getServerNumPortsRequired(server);
			if (requiredPorts > 0) {
				penetrate(server);
			}
			ns.tprint("Gaining root access on " + server);
			ns.nuke(server);
		} else {
			ns.tprint("Already have root access on " + server);
		}
	}

	var banana = await gainAccess(server);
	ns.print(banana);
}
