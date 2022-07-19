import { attackActions } from "scripts/utils";

/**
 * Lightweight attack script leveraging the batch fleet attack logic.
 * @remarks RAM cost 2.0GB
 * @param {NS} ns
 */
export async function main(ns) {
	const action = ns.args[0];
	const target = ns.args[1];
	const delay = ns.args[2];
	const processID = ns.args[3];

	ns.print(processID);
	await ns.sleep(delay);

	if (action == attackActions.weaken) {
		await ns.weaken(target);
	} else if (action == attackActions.grow) {
		await ns.grow(target);
	} else {
		await ns.hack(target);
	}
}
