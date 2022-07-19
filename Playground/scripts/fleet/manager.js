import { bestAttack } from "scripts/fleet/best-attack";

/** @param {NS} ns */
export async function main(ns) {
	// Main manager of the hack fleet. Orchestrates the scanning, planning, timing, and batching of attacks.
	// Logic:
	// - Scan all servers
	// - Find the most profitable server
	// - Set up batches to prepare servers for the next attack.
	//   1. Weaken (until minimum security)
	//   2. Grow (until maxed money)
	// - Find timings for the attack
	// - Set up a batch for the attack where the commands finish in this order:
	//   1. Hack
	//   2. Weaken
	//   3. Grow
	//   4. Weaken
	// Orchestrate through separate services:
	// - Manager (Orchestrates the operation as a whole)
	// - Scanner (scans all target servers, finds timings and profits)
	// - Batcher (Keeps track of grouped server fleets for attacks)
	//  - Prioritizes good attack servers for the most valuable targets
	//  - Servers are added to their batches based on their priority
	// - Timer (Schedules attacks for batched servers)
	// - Attacker (Executes attacks)
	const attackList = bestAttack();
	const attackTimings = getTimings(attackList);
}
