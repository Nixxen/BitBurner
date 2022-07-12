import { getNetworkNodes, canHack, getServerHackingInfo } from "scripts/utils";

/**
 * Scans the network for servers that can be hacked, and returns a list
 * of servers that can be hacked, ordered by most money potential.
 * @param {NS} ns
 * @returns {Promise<Array>} a sorted list of servers that can be hacked
 */
export async function bestAttack(ns) {
	const origin = "home";
	const networkNodes = getNetworkNodes(ns, origin);
	ns.tprint(`Found ${networkNodes.length} nodes in the network`);
	const hackableServers = networkNodes.filter(
		(node) => !node.includes("pserv") && canHack(ns, node)
	);
	ns.tprint(`Found ${hackableServers.length} hackable servers`);
	const serverInfo = hackableServers
		.map((node) => {
			return getServerHackingInfo(ns, node);
		})
		.sort((a, b) => {
			return b.maxMoney - a.maxMoney;
		});
	ns.tprint(`Sorted ${serverInfo.length} servers by max money`);
	ns.tprint(
		`${
			serverInfo[0].name
		} has the most money potential, details: ${JSON.stringify(
			serverInfo[0]
		)}`
	);
	return serverInfo;
}

/** @param {NS} ns */
export async function main(ns) {
	const result = await bestAttack(ns);
	return result;
}
