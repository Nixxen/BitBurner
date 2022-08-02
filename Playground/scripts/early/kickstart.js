/**
 * Automated early start script. Makes new augment installs less tedious.
 * Runs player server scripts to boost hacking level, purchase servers and
 * upgrade hacknet nodes.
 * @param {NS} ns
 */
export async function main(ns) {
	// Buy servers
	const serverPurchaseScript = "/scripts/early/purchase-servers.js";
	// Using n00dles as default target for pserv for quick hack skills in the start.
	const pservTarget = ns.args[0] || "n00dles";
	const pidServers = ns.run(serverPurchaseScript, 1, pservTarget);

	// Buy hacknet nodes
	const hacknetPurchaseScript = "/scripts/early/upgrade-hacknet-roi.js";
	const roiCutoff = ns.args[1] || 48; // Default ROI cutoff
	const pidHacknet = ns.run(hacknetPurchaseScript, 1, roiCutoff);

	// Execute early hacks
	const hackScript = "/scripts/early/early-hack.js";
	const pidHacks = ns.run(hackScript, 1);

	ns.tprint(
		`${ns.getScriptName()} finished. Kickstarted the following process PIDs: ${pidServers}, ${pidHacknet}, ${pidHacks}`
	);
}
