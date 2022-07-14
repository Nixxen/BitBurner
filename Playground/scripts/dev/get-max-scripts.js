/**
 * Calculates the maximum number of scripts of the given kind that can be
 * ran on the server.
 * Argument 1 is the script
 * Argument 2 is the server. If no server is given, home will be used.
 * @param {NS} ns
 */
export async function main(ns) {
	const getMaxScripts = (script, server) => {
		const scriptRam = ns.getScriptRam(script);
		const serverMaxRam = ns.getServerMaxRam(server);
		const serverUsedRam = ns.getServerUsedRam(server);
		const serverFreeRam = serverMaxRam - serverUsedRam;
		const maxScripts = Math.floor(serverFreeRam / scriptRam);
		return maxScripts;
	};
	const padPath = (script) => {
		const path = script.split("/");
		if (path.length === 1) {
			return path[0];
		} else {
			const padding = path[0] == "" ? "" : "/";
			const paddedPath = padding + path.join("/");
			return paddedPath;
		}
	};

	const scriptRaw = ns.args[0];
	const server = ns.args[1] || "home";
	const script = padPath(scriptRaw);
	if (ns.fileExists(script)) {
		const maxScripts = getMaxScripts(script, server);
		ns.tprint(
			`Max number of "${script}" to run on server "${server}" is ${maxScripts}`
		);
	} else {
		ns.tprint(`Script "${script}" does not exist`);
		const exist = ns.fileExists("utils.js");
		ns.tprint(`Utils script exists: ${exist}`);
	}
}
