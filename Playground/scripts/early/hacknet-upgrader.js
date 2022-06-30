/** @param {NS} ns */
export async function main(ns) {
	let openlist = [...Array(ns.hacknet.numNodes()).keys()];
	let closedlist = [];

	let maxNodes = ns.args[0]; // Arbitrary cutoff. 20-25 is where the cost really starts outweighing the benefit
	let maxLevelPerUpgrade = 40;
	let minLevelPerUpgrade = 1;
	let levelPerUpgrade = maxLevelPerUpgrade; // Just to speed things up in the start
	let upgraded = false;

	ns.tprint("Auto purchasing and upgrading nodes until " + maxNodes + " nodes are purchased and fully upgraded.");

	function isUnderNodesCapacity(){
		return ns.hacknet.numNodes() <= maxNodes
	} 

	function isAllNodesProcessed(){
		return openlist.length == closedlist.length
	} 

	while(isUnderNodesCapacity() || !isAllNodesProcessed()) {
		if (isUnderNodesCapacity()){
			let res = ns.hacknet.purchaseNode();
			if (res != -1){
				ns.print("Purchased hacknet Node with index " + res);
				openlist.push(res);
			}
		}
		if (!isAllNodesProcessed()){
			upgraded = false;
			for (let i in openlist){
				if (!(i in closedlist)){
					// Upgrades. Report if success
					if (ns.hacknet.upgradeLevel(i, levelPerUpgrade)){
						ns.print("Upgraded level of Node with index " + i + " by " + levelPerUpgrade);
						upgraded = true;
					}
					if (ns.hacknet.upgradeRam(i, levelPerUpgrade)){
						ns.print("Upgraded ram of Node with index " + i + " by " + levelPerUpgrade);
						upgraded = true;
					}
					if (ns.hacknet.upgradeCore(i, levelPerUpgrade)){
						ns.print("Upgraded core of Node with index " + i + " by " + levelPerUpgrade);
						upgraded = true;
					}
					// Add to closedlist if all upgrades are complete.
					if (ns.hacknet.getLevelUpgradeCost(i, 1) == Infinity
						&& ns.hacknet.getRamUpgradeCost(i, 1) == Infinity
						&& ns.hacknet.getCoreUpgradeCost(i, 1) == Infinity){
						ns.print("Node " + i + " is fully upgraded. Removing from upgrade loop");
						ns.tprint("Node " + i + " is fully upgraded. Removing from upgrade loop");
						closedlist.push(i);
						//ns.print("Closedlist: " + closedlist);
					}
				}
			}
			if (upgraded){
				let alreadyMax = levelPerUpgrade == maxLevelPerUpgrade;
				if (!alreadyMax){
					levelPerUpgrade = Math.min(maxLevelPerUpgrade, levelPerUpgrade + 1);
					ns.print("Upgrades happened. Increasing upgrade level to " + levelPerUpgrade);
				}
			}else{
				let alreadyMin = levelPerUpgrade == minLevelPerUpgrade;
				if (!alreadyMin){
					levelPerUpgrade = Math.max(minLevelPerUpgrade, Math.ceil(levelPerUpgrade/2));
					ns.print("No upgrades this loop. Reducing upgrade level by half to " + levelPerUpgrade);
				}
			}
		}else{
			ns.print("Exhausted openlist...")
		}	
		await ns.sleep(10000); // Sleep some time between each purchase/loop.
	}
	ns.tprint("Node limit reached. All nodes fully upgraded. Exiting...");
}