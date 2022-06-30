/** @param {NS} ns */
export async function main(ns) {
	let counter = 0;
	while (counter < 5){
		ns.tprint("Hello, World!");
		await ns.sleep(1000);
		counter += 1;
	}
}