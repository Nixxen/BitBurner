import { takeOwnership } from "scripts/fleet/take-ownership";
/**
 *
 * @param {NS} ns
 */
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	ns.disableLog("getHackingLevel");
	ns.disableLog("run");

	const home = "home";
	// Predefine early targets
	// TODO: Use scan and get hacking info? Might not be available on a freshly
	//      installed game. Problem for future me. Should only target low level
	//      servers. Ports might be a problem if the player does not have
	//      the cracks. Also, problem for future me.
	const targets = [
		{
			server: "n00dles",
			threshold: 5,
		},
		{
			server: "sigma-cosmetics",
			threshold: 10,
		},
		{
			server: "joesguns",
			threshold: 30,
		},
		{
			server: "hong-fang-tea",
			threshold: 40,
		},
		{
			server: "harakiri-sushi",
			threshold: 100,
		},
		{
			server: "iron-gym",
			threshold: 150,
		},
		{
			server: "silver-helix",
			threshold: 185,
		},
		{
			server: "omega-net",
			threshold: 285,
		},
		{
			server: "the-hub",
			threshold: 352,
		},
		{
			server: "I.I.I.I",
			threshold: 473,
		},
	];
	const hackScript = "/scripts/early/hack-server.js";
	const hackScriptCost = ns.getScriptRam(hackScript);

	const lastTarget = targets[targets.length - 1];
	let currentTarget = 0;
	// Smooths out the start percentage of the next server transit.
	// Rated in percentage (e.g. 0.2 = 20%).
	const thresholdHysteresis = 0.2;

	while (ns.getHackingLevel() <= lastTarget.threshold) {
		if (currentTarget > targets.length - 1) {
			break;
		}
		let target = targets[currentTarget];
		if (
			ns.getHackingLevel() >
			target.threshold * (1 + thresholdHysteresis)
		) {
			currentTarget += 1;
			ns.tprint(
				`Player hacking level, ${ns.getHackingLevel()}, exceeds threshold for ${
					target.server
				}, ${target.threshold} + ${
					target.threshold * thresholdHysteresis
				}. Attacking next server.`
			);
			continue;
		}
		if (!ns.hasRootAccess(target.server)) {
			const gotAccess = await takeOwnership(ns, target.server);
			ns.tprint(`GotAccess: ${gotAccess}`);
			if (!gotAccess) {
				ns.tprint(
					`Could not take ownership of ${target.server}. Aborting.`
				);
				break;
			}
		}

		const maxThreads = Math.floor(
			(ns.getServerMaxRam(home) - ns.getServerUsedRam(home)) /
				hackScriptCost
		);
		const pid = ns.run(hackScript, maxThreads, target.server);

		if (pid == 0) {
			ns.tprint(`Could not run ${hackScript}. Aborting.`);
			break;
		}
		ns.print(
			`Attacking ${target.server} with threshold ${target.threshold} + ${
				target.threshold * thresholdHysteresis
			}. Current hack skill is ${ns.getHackingLevel()}.`
		);
		while (ns.isRunning(pid)) {
			await ns.sleep(1000);
		}

		await ns.sleep(1000); // Just a safeguard to avoid locking up.
	}
	ns.tprint("Exhausted all servers in the early-hack script.");
}
