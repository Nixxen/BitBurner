import { getNetworkNodes, canHack } from "../util";

/** @param {NS} ns */
export async function main(ns) {
	// Scans all servers and finds the most profitable, single attack, server.
	// This is only profitable for single attacks, not multiple servers attacking the same server.
	// Logic:
	// - Get all servers on the network (DFS)
	// - For each server, filter for hackable (based on current hack skill, ignoring pserv)
	// - For each hackable server, get server info
	// - Sort servers by profit (max money? Does hacking level affect this? Other factors?)
	// - Return the most profitable server (or save the list of all servers for later)

	const networkNodes = getNetworkNodes(ns);
	const hackableServers = networkNodes.filter(
		(node) => !node.includes("pserv") && canHack(ns, node)
	);
}
