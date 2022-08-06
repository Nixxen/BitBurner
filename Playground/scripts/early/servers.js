/**
 * General manual server handling from the terminal, since the game has no built
 * in ways to interact with the servers through the terminal.
 * @param {NS} ns
 * @argument {command} command to execute
 * @argument {server} server to execute command on (if applicable)
 **/
export async function main(ns) {
	const command = ns.args[0];
	if (!command || command == "list") {
		const servers = ns.getPurchasedServers();
		ns.tprint(`Purchased servers: ${servers.join(", ")}`);
		return;
	} else if (command == "delete") {
		const server = ns.args[1];
		if (!server) {
			ns.tprint("Usage: servers delete <server>");
			return;
		}
		if (ns.serverExists(server)) {
			await shutdownServer(server);
		} else {
			ns.tprint(`Server ${target} does not exist`);
		}
		return;
	}
	const target = ns.args[0];
	if (!target) {
		ns.tprint("No target specified. Exiting.");
		return;
	}

	const shutdownServer = (server) => {
		// Nuclear option. Kill all scripts.
		if (ns.killall(server)) {
			ns.tprint(
				`Server ${server} had running scripts. They were successfully killed.`
			);
		}

		const result = ns.deleteServer(server);
		if (result) {
			ns.tprint(`Deleted server ${target}`);
		} else {
			ns.tprint(`Failed to delete server ${target}`);
		}
		return;
	};
}
