/** @param {NS} ns **/
export async function main(ns) {
	const target = ns.args[0];
	const origin = ns.getHostname();

	// patterns that indicates whether we ignore them
	const ignored = ["pserv"];

	const hasIgnoredString = (text) => {
		return ignored.some(function (str) {
			return text.includes(str);
		});
	};

	// Use DFS to find visit all nodes in the network until we find
	// the target server
	function getNetworkNodePairs() {
		let visited = {};
		let stack = [];
		stack.push(origin);
		let nodePairs = [];

		while (stack.length > 0) {
			const node = stack.pop();
			if (!visited[node]) {
				if (node === target) {
					break;
				}
				visited[node] = node;
				const neighbours = ns.scan(node);
				for (let i = 0; i < neighbours.length; i++) {
					const child = neighbours[i];
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
		return nodePairs;
	}

	function reconstructPath(nodes) {
		// for every node, map them to parent
		const parentMap = nodes.reduce(function (acc, node) {
			acc[node.current] = node.parent;
			return acc;
		}, {});

		ns.print("Target found. Recreating path");
		ns.print("Number of nodes tracked: " + nodes.length);
		let path = [];
		let curNode = target;
		while (curNode !== origin) {
			path.push(curNode);
			ns.print("Adding server to path: " + curNode);
			var parent = parentMap[curNode];
			if (!parent) {
				break;
			}
			curNode = parent;
		}

		return path.reverse();
	}

	const nodes = getNetworkNodePairs();
	const path = reconstructPath(nodes);
	ns.tprint(path);
}
