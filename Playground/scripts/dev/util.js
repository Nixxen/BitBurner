/**
 * Range generator. Use in for ... of loops
 * @param {NS} ns
 */
export function* range(start = 0, end = null, step = 1) {
	if (end == null) {
		end = start;
		start = 0;
	}

	for (let i = start; i < end; i += step) {
		yield i;
	}
}

/**
 * Returns a list of all nodes in the network using DFS
 * @remarks RAM cost: 0.2GB
 * @param {NS} ns
 * @returns {string[]} List of all nodes in the network
 */
export function getNetworkNodes(ns) {
	let visited = {};
	let stack = [];
	stack.push(origin);
	let nodes = [];
	while (stack.length > 0) {
		const node = stack.pop();
		if (!visited[node]) {
			visited[node] = node;
			const neighbors = ns.scan(node);
			for (const neighbor of neighbors) {
				if (visited[neighbor]) {
					continue;
				}
				stack.push(neighbor);
				nodes.push(neighbor);
			}
		}
	}
	return nodes;
}

/**
 * Checks if a server can be hacked by the player
 * @remarks RAM cost 0.15GB
 * @param {NS} ns
 * @param {string} node server to check
 * @returns {boolean} true if server can be hacked
 */
export function canHack(ns, node) {
	const hackSkill = ns.getHackingLevel();
	const nodeHackSkill = ns.getServerRequiredHackingLevel(node);
	return hackSkill >= nodeHackSkill;
}
