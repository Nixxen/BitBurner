/**
 * Automated early start script. Makes new augment installs less tedious.
 * Runs player server scripts to boost hacking level, purchase servers and
 * upgrade hacknet nodes.
 * @argument {0} Server to attack for both pserv and deploy. Defaults to n00dles
 * @argument {1} Max purchase cost for new servers. Defaults to 1b.
 * @argument {2} ROI cutoff in hours for hacknet upgrades. Defaults to 48
 * @param {NS} ns
 */
export async function main(ns) {
	// Buy servers
	const serverPurchaseScript = "/scripts/early/purchase-servers.js";
	// Using n00dles as default target for pserv for quick hack skills in the start.
	const pservTarget = ns.args[0] || "n00dles";
	const pservLimit = ns.args[1] || 1 * 10 ** 9;
	if (ns.isRunning(serverPurchaseScript, "home", pservTarget, pservLimit)) {
		ns.kill(serverPurchaseScript, "home", pservTarget, pservLimit);
	}
	const pidServers = ns.run(serverPurchaseScript, 1, pservTarget, pservLimit);

	// Buy hacknet nodes
	const hacknetPurchaseScript = "/scripts/early/upgrade-hacknet-roi.js";
	const roiCutoff = ns.args[2] || 48; // Default ROI cutoff
	if (ns.isRunning(hacknetPurchaseScript, "home", roiCutoff)) {
		ns.kill(hacknetPurchaseScript, "home", roiCutoff);
	}
	const pidHacknet = ns.run(hacknetPurchaseScript, 1, roiCutoff);

	// Execute early deploy (using same target as pserv)
	const deployScript = "/scripts/early/deploy.js";
	if (ns.isRunning(deployScript, "home", pservTarget)) {
		ns.kill(deployScript, "home", pservTarget);
	}
	const pidDeploy = ns.run(deployScript, 1, pservTarget);

	// Execute early hacks
	const hackScript = "/scripts/early/early-hack.js";
	if (ns.isRunning(hackScript, "home")) {
		ns.kill(hackScript, "home");
	}
	const pidHacks = ns.run(hackScript, 1);

	// If any PID is 0, something is wrong.
	if (pidServers * pidHacknet * pidHacks * pidDeploy === 0) {
		ns.tprint(
			"One or more scripts failed to start (any with PID 0 failed). Please check your script arguments."
		);
	}

	ns.tprint(
		`${ns.getScriptName()} finished. Kickstarted the following process (PID): ${serverPurchaseScript}(${pidServers}), ${hacknetPurchaseScript}(${pidHacknet}), ${hackScript}(${pidHacks}), ${deployScript}(${pidDeploy})`
	);
}
