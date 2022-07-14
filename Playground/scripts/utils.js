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
 * @param {string} origin The node to start the DFS from
 * @returns {string[]} List of all nodes in the network
 */
export function getNetworkNodes(ns, origin) {
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

/**
 * Returns the money the player has
 * @remarks RAM cost 0.1GB
 * @param {NS} ns
 * @returns {number} money the player has
 */
export function getPlayerMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

/**
 * Scrapes a server for hacking-relevant information
 * @remarks RAM cost 2.8GB
 * @param {NS} ns
 * @param {string} node server to scrape
 * @returns {object} object containing the server's hacking-relevant information
 */
export function getServerHackingInfo(ns, node) {
	const money = ns.getServerMaxMoney(node);
	const hackChance = getHackChance(ns, node);
	const hackRating = money * hackChance;
	return {
		name: node,
		maxMoney: money,
		minSecurity: ns.getServerMinSecurityLevel(node),
		hackLevel: ns.getServerRequiredHackingLevel(node),
		hackChance: hackChance,
		hackRating: hackRating,
	};
}

/**
 * Get the players probability of successfully hacking a server
 * @remarks RAM cost 2.5GB
 * @param {NS} ns
 * @param {string} node server to check
 */
export function getHackChance(ns, node) {
	const server = ns.getServer(node);
	const player = ns.getPlayer();
	return ns.formulas.hacking.hackChance(server, player);
}

/**
 * Write an object to a file as JSON
 * @param {NS} ns
 * @param {list} list List of objects
 * @param {string} filename Name of the file to write to
 */
export async function writeObjectToFile(ns, list, filename) {
	let stringList = [];
	for (let obj of list) {
		stringList.push(JSON.stringify(obj));
	}
	const content = stringList.join("\n");
	await ns.write(filename, content, "w");
	ns.alert(content);
	ns.toast(`Wrote object to ${filename}`, "success", 3000);
}
