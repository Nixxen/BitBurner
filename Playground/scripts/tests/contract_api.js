/** @param {NS} ns */
export async function main(ns) {
	const server = ns.args[0];
	const filename = ns.args[1];

	const contractType = ns.codingcontract.getContractType(filename, server);
	ns.tprint("Contract type: " + contractType);

	const contractData = ns.codingcontract.getData(filename, server);
	ns.tprint("Contract data: " + contractData);

	const contractDescription = ns.codingcontract.getDescription(
		filename,
		server
	);
	ns.tprint("Contract description: " + contractDescription);

	const contractTries = ns.codingcontract.getNumTriesRemaining(
		filename,
		server
	);
	ns.tprint("Contract tries: " + contractTries);
}
