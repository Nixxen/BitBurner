import {
	getNetworkNodes,
	canHack,
	getServerHackingInfo,
	writeObjectToFile,
} from "scripts/utils";

/**
 * Scans the network for servers that can be hacked, and returns a list
 * of servers that can be hacked, ordered by most money potential.
 * @remarks RAM cost 3.7GB
 * @param {NS} ns
 * @param {string} sortOn The property to sort the servers by. Default is "hackRating".
 * @returns {Promise<Array>} a sorted list of servers that can be hacked
 */
export async function getBestAttack(ns, sortOn = "hackRating") {
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
			return b[sortOn] - a[sortOn];
		});
	return serverInfo;
}

/** @param {NS} ns */
export async function main(ns) {
	const filename = "best-attack.txt";
	const result = await getBestAttack(ns, ns.args[0]);
	await writeObjectToFile(ns, result, filename);
	return result;
}
