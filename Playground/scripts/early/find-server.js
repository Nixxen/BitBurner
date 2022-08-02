/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0];
	const origin = ns.getHostname();
	let foundTarget = "";

	// patterns that indicates whether we ignore them
	const ignored = ["pserv"];

	const hasIgnoredString = (text) => {
		return ignored.some(function (str) {
			return text.includes(str);
		});
	};

	// Use DFS to find visit all nodes in the network until we find
	// the target server
	const getNetworkNodePairs = () => {
		let visited = {};
		let stack = [];
		stack.push(origin);
		let nodePairs = [];

		while (stack.length > 0) {
			const node = stack.pop();
			if (!visited[node]) {
				if (node.includes(target)) {
					foundTarget = node;
					break;
				}
				visited[node] = true;
				const neighbors = ns.scan(node);
				for (let i = 0; i < neighbors.length; i++) {
					const child = neighbors[i];
					if (hasIgnoredString(child) || visited[child]) {
						continue;
					}
					stack.push(child);
					const pair = {
						parent: node,
						current: child,
					};
					nodePairs.push(pair);
				}
			}
		}
		if (stack.length === 0) {
			ns.tprint("Exhausted network, node not found");
			return null;
		}
		return nodePairs;
	};

	function reconstructPath(nodes) {
		// for every node, map them to parent
		const parentMap = nodes.reduce((acc, node) => {
			acc[node.current] = node.parent;
			return acc;
		}, {});

		ns.print("Target found. Recreating path");
		ns.print("Number of nodes tracked: " + nodes.length);
		let path = [];
		let curNode = foundTarget;
		while (curNode !== origin) {
			path.push(curNode);
			ns.print("Adding server to path: " + curNode);
			const parent = parentMap[curNode];
			ns.print("Parent: " + parent);
			if (!parent) {
				ns.tprint("Error: parent not found for node " + curNode);
				break;
			}
			curNode = parent;
		}

		return path.reverse();
	}

	const nodes = getNetworkNodePairs();
	if (!nodes) {
		return;
	}
	const path = reconstructPath(nodes);
	ns.tprint(path);
}
