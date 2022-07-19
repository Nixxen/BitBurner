import {
	getNetworkNodes,
	canHack,
	getServerHackingInfo,
	writeObjectToFile,
} from "scripts/utils";

/**
 * Scans the network for servers that can be hacked, and returns a list
 * of servers that can be hacked, ordered by most money potential.
 * @remarks RAM cost 3.15GB
 * @param {NS} ns
 * @returns {Promise<Array>} a sorted list of servers that can be hacked
 */
export async function bestAttack(ns) {
	const origin = "home";
	const networkNodes = getNetworkNodes(ns, origin);
	ns.tprint(`All nodes in the network: ${networkNodes}`);
	const hackableServers = networkNodes.filter(
		(node) => !node.includes("pserv") && canHack(ns, node)
	);
	const serverInfo = hackableServers
		.map((node) => {
			return getServerHackingInfo(ns, node);
		})
		.sort((a, b) => {
			return b.hackRating - a.hackRating;
		});
	return serverInfo;
}

/** @param {NS} ns */
export async function main(ns) {
	const filename = "best-attack.txt";
	const result = await bestAttack(ns);
	await writeObjectToFile(ns, result, filename);
	return result;
}