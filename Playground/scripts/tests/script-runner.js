/** @param {NS} ns */
export async function main(ns) {
	let workingDirectory = "/scripts/tests/";
	let script = "/scripts/tests/hello-world.js";
	let server = "n00dles";
	ns.tprint("Running local script: " + script);
	ns.run(script, 1);
	ns.tprint("Finished local running script");
	ns.tprint("Copying script to server: " + server);
	await ns.scp(script, server);
	if (ns.scriptRunning(script, server)) {
			ns.scriptKill(script, server);
		}
	ns.tprint("Running remote script: " + script + " on server: " + server);
	ns.exec(script, server, 1);
	ns.tprint("Finished remote running script");
}