import { range } from "/scripts/dev/util.js";

/** @param {NS} ns */
export async function main(ns) {
	// Return Of Investment (ROI) based hacknet upgrade script. Will pick the lowest possible roi upgrade, and upgrade that.
	// There is a cutoff limit argument input of when to stop upgrading, since the player would most likely reset the game before reaching that time.
	// Arguments:
	//  arg0: Hours to cut off ROI calculation. Defaults to 24 hours.

	// Money saving to not bleed the player dry while purchasing hacknet nodes
	const moneyKeepLimit = 15 * 10 ** 6; // 15m - Adjust this lower if you do not have enough yet (or higher if you want more spare money)

	// Ram saving for early runs when you do not have augmentations yet:
	//  - Comment out the line marked "<- Comment out this line to save 4gb of ram", a few lines under this message.
	//  - Remember to uncomment the line once you get some augmentations.

	// Initialize default multipliers for simplicity.
	let playerMultipliers = {
		production: 1,
		purchaseCost: 1,
		ramCost: 1,
		coreCost: 1,
		levelCost: 1,
	};
	// Get player multipliers. Can be changed with augmentations. If you have no augmentations, the default values above are good enough.
	playerMultipliers = ns.getHacknetMultipliers(); // <- Comment out this line to save 4gb of ram

	// Print to both log and terminal.
	const consoleWarn = (message) => {
		ns.tprint(message);
		ns.print(message);
	};

	// Warning! Hard coded constants based on Formulas.exe. These might change!
	// Check that they still match by running ns.tprint(ns.formulas.hacknetNodes.constants()) after building or purchasing "Formulas.exe"
	let hacknetConstants = {
		MoneyGainPerLevel: 1.5,
		BaseCost: 1000,
		LevelBaseCost: 1,
		RamBaseCost: 30000,
		CoreBaseCost: 500000,
		PurchaseNextMult: 1.85,
		UpgradeLevelMult: 1.04,
		UpgradeRamMult: 1.28,
		UpgradeCoreMult: 1.48,
		MaxLevel: 200,
		MaxRam: 64,
		MaxCores: 16,
	};
	// Update the constants from formulas if 'formulas.exe' is available.
	if (ns.fileExists("Formulas.exe", "home")) {
		hacknetConstants = ns.formulas.hacknetNodes.constants();
	} else {
		consoleWarn(
			"Warning - Using hardcoded hacknet constants since 'Formulas.exe' has not been built yet. These constants might be out of date."
		);
	}

	const getPlayerMoney = () => ns.getServerMoneyAvailable("home");
	const getROI = (cost, productionIncrease) => {
		if (productionIncrease != 0) {
			const roi = cost / productionIncrease;
			if (roi < 0) {
				consoleWarn(
					"Error! Calculating ROI to negative value. Check the logic! This WILL cause issues, and this function WILL let it happen!"
				);
			}
			return roi;
		} else return Infinity;
	};
	const playerCanAfford = (cost) => {
		return getPlayerMoney() - cost > moneyKeepLimit;
	};
	const purchaseNode = async (cost) => {
		ns.print(
			`\tPurchasing new Hacknet Node. Cost: ${ns.nFormat(
				cost,
				"0.00a"
			)}/${ns.nFormat(
				getPlayerMoney() - moneyKeepLimit,
				"0.00a"
			)} (with ${ns.nFormat(moneyKeepLimit, "0.00a")} offset).`
		);
		let attemptingPurchase = true;
		while (attemptingPurchase) {
			if (playerCanAfford(cost)) {
				const res = ns.hacknet.purchaseNode();
				if (res != -1) {
					attemptingPurchase = false;
					ns.print(`\tPurchased Hacknet Node with index ${res}`);
					openList.push(res); // The res is the index of the node.
					continue;
				}
			}
			await ns.sleep(sleepWaitingTimeout);
		}
	};
	const upgradeLevel = async (cost, nodeIndex) => {
		ns.print(
			`\tUpgrading level on Hacknet node with index ${nodeIndex} to ${
				getNode(nodeIndex).level + 1
			}. Cost: ${ns.nFormat(cost, "0.00a")}/${ns.nFormat(
				getPlayerMoney() - moneyKeepLimit,
				"0.00a"
			)} (with ${ns.nFormat(moneyKeepLimit, "0.00a")} offset).`
		);
		let attemptingUpgrade = true;
		while (attemptingUpgrade) {
			if (playerCanAfford(cost)) {
				const res = ns.hacknet.upgradeLevel(nodeIndex, 1);
				if (res) {
					attemptingUpgrade = false;
					ns.print(
						`\tUpgraded level on Hacknet Node with index ${nodeIndex} to ${
							getNode(nodeIndex).level
						}`
					);
					continue;
				}
			}
			await ns.sleep(sleepWaitingTimeout);
		}
	};
	const upgradeRam = async (cost, nodeIndex) => {
		ns.print(
			`\tUpgrading ram on Hacknet node with index ${nodeIndex} to ${
				getNode(nodeIndex).ram + 1
			}. Cost: ${ns.nFormat(cost, "0.00a")}/${ns.nFormat(
				getPlayerMoney() - moneyKeepLimit,
				"0.00a"
			)} (with ${ns.nFormat(moneyKeepLimit, "0.00a")} offset).`
		);
		let attemptingUpgrade = true;
		while (attemptingUpgrade) {
			if (playerCanAfford(cost)) {
				const res = ns.hacknet.upgradeRam(nodeIndex, 1);
				if (res) {
					attemptingUpgrade = false;
					ns.print(
						`\tUpgraded ram on Hacknet Node with index ${nodeIndex} to ${
							getNode(nodeIndex).ram
						}`
					);
					continue;
				}
			}
			await ns.sleep(sleepWaitingTimeout);
		}
	};
	const upgradeCore = async (cost, nodeIndex) => {
		ns.print(
			`\tUpgrading core on Hacknet node with index ${nodeIndex} to ${
				getNode(nodeIndex).cores + 1
			}. Cost: ${ns.nFormat(cost, "0.00a")}/${ns.nFormat(
				getPlayerMoney() - moneyKeepLimit,
				"0.00a"
			)} (with ${ns.nFormat(moneyKeepLimit, "0.00a")} offset).`
		);
		let attemptingUpgrade = true;
		while (attemptingUpgrade) {
			if (playerCanAfford(cost)) {
				const res = ns.hacknet.upgradeCore(nodeIndex, 1);
				if (res) {
					attemptingUpgrade = false;
					ns.print(
						`\tUpgraded core on Hacknet Node with index ${nodeIndex} to ${
							getNode(nodeIndex).cores
						}`
					);
					continue;
				}
			}
			await ns.sleep(sleepWaitingTimeout);
		}
	};
	const getNextNodeCost = () => {
		return ns.hacknet.getPurchaseNodeCost();
	};
	const getNode = (nodeIndex) => {
		return ns.hacknet.getNodeStats(nodeIndex);
	};
	// Cheeky production and increase derived from https://github.com/danielyxie/bitburner/blob/535812a0fc4307a7bf767fdcca760f39d3206ade/src/Hacknet/formulas/HacknetNodes.ts#L4
	const getProduction = (level, ram, cores, mult) =>
		level *
		hacknetConstants.MoneyGainPerLevel *
		Math.pow(1.035, ram - 1) *
		((cores + 5) / 6) *
		mult;
	const getLevelIncrease = (nodeIndex) => {
		const node = getNode(nodeIndex);
		const levelsToMax = hacknetConstants.MaxLevel - node.level;
		const multiplier = Math.min(levelsToMax, 1);
		const newProduction = getProduction(
			node.level + multiplier,
			node.ram,
			node.cores,
			playerMultipliers.production
		);
		return newProduction - node.production;
	};
	const getCoreIncrease = (nodeIndex) => {
		const node = getNode(nodeIndex);
		const levelsToMax = hacknetConstants.MaxCores - node.cores;
		const multiplier = Math.min(levelsToMax, 1);
		const newProduction = getProduction(
			node.level,
			node.ram,
			node.cores + multiplier,
			playerMultipliers.production
		);
		return newProduction - node.production;
	};
	const getRamIncrease = (nodeIndex) => {
		const node = getNode(nodeIndex);
		const levelsToMax = Math.round(
			Math.log2(hacknetConstants.MaxRam / node.ram)
		);
		const multiplier = Math.min(levelsToMax, 1);
		const newProduction = getProduction(
			node.level,
			node.ram * Math.pow(2, multiplier),
			node.cores,
			playerMultipliers.production
		);
		return newProduction - node.production;
	};
	const getBaseNodeIncrease = () => {
		return getProduction(1, 1, 1, playerMultipliers.production);
	};
	// TODO: Deprecated? There is current production info in ns.hacknet.getNodeStats().production. Leaving it here in case it is required later.
	const getCurrentProduction = (node) => {
		return getProduction(
			node.level,
			node.ram,
			node.cores,
			playerMultipliers.production
		);
	};
	const pruneComplete = (nodeIndex) => {
		// Remove note from upgrade checking if it is fully upgraded.
		const stats = getNode(nodeIndex);
		const is_max_upgrade = (stats) => {
			if (
				stats.cores >= hacknetConstants.MaxCores &&
				stats.ram >= hacknetConstants.MaxRam &&
				stats.level >= hacknetConstants.MaxLevel
			) {
				return true;
			}
			return false;
		};
		if (is_max_upgrade(stats)) {
			closedList.push(nodeIndex);
			ns.print(
				`Info - Node with index ${nodeIndex} has been fully upgraded and will be ignored in the upgrade cycle.`
			);
		}
	};

	const pruneOverROI = (nodeIndex, roi) => {
		// Remove note from upgrade checking if its best ROI is higher than the cutoff time.
		if (roi > cutoffTime) {
			closedList.push(nodeIndex);
			ns.print(
				`Info - Node with index ${nodeIndex} has best action with ROI ${ns.nFormat(
					roi,
					"00:00:00"
				)}, but ROI cutoff is ${ns.nFormat(
					cutoffTime,
					"00:00:00"
				)}. No upgrades left under the ROI limit. Node will be ignored in the upgrade cycle.`
			);
		}
	};

	const actions = {
		purchaseNode: 0,
		upgradeLevel: 1,
		upgradeRam: 2,
		upgradeCore: 3,
	};

	const hours = ns.args[0] || 24;
	consoleWarn(
		`Info - Auto purchasing and upgrading hacknet nodes until ROI exceeds cutoff time of ${hours} hours.`
	);
	const cutoffTime = hours * 60 * 60; // Max time to allow for ROI. n hours * 60 minutes * 60 seconds = seconds per n hours.
	const sleepWaitingTimeout = 10000; // When awaiting money
	const sleepPurchaseTimeout = 200; // After each successful purchase
	let openList = [...Array(ns.hacknet.numNodes()).keys()];
	let closedList = [];

	if (openList.length == 0) {
		// Purchase your first Hacknet node
		const roi = getROI(getNextNodeCost(), getBaseNodeIncrease());
		if (roi < cutoffTime) {
			await purchaseNode(getNextNodeCost());
		}
	}

	while (openList.length - closedList.length > 0) {
		// Silence log spam
		ns.disableLog("disableLog");
		ns.disableLog("sleep");
		ns.disableLog("getServerMoneyAvailable");

		// Use purchase node as the default action. Any upgrades will overwrite it.
		let bestNodeIndex = -1;
		let bestAction = actions.purchaseNode;
		let bestCost = getNextNodeCost();
		let bestIncrease = getBaseNodeIncrease();
		let bestROI = getROI(bestCost, bestIncrease);

		// TODO: Scan n steps ahead, to see if it would be more profitable to purchase a node then upgrade, than to upgrade a current node.
		// Scan all hacknet nodes, check if upgrades are cheaper than default action.
		for (let o of openList) {
			if (!(o in closedList)) {
				let nodeBestROI = Infinity;
				for (let action of range(1, 4)) {
					let cost = Infinity;
					let increase = 1;
					if (action == actions.upgradeLevel) {
						cost = ns.hacknet.getLevelUpgradeCost(o, 1);
						increase = getLevelIncrease(o);
					} else if (action == actions.upgradeRam) {
						cost = ns.hacknet.getRamUpgradeCost(o, 1);
						increase = getRamIncrease(o);
					} else if (action == actions.upgradeCore) {
						cost = ns.hacknet.getCoreUpgradeCost(o, 1);
						increase = getCoreIncrease(o);
					} else {
						consoleWarn(
							`Error! Unexpected action! ActionIndex: ${action} - Action: ${Object.keys(
								actions
							).find((key) => actions[key] === action)}.`
						);
					}
					const actionROI = getROI(cost, increase);
					if (actionROI < bestROI) {
						bestNodeIndex = o;
						bestAction = action;
						bestCost = cost;
						bestIncrease = increase;
						bestROI = actionROI;
					}
					if (actionROI < nodeBestROI) {
						nodeBestROI = actionROI;
					}
				}
				pruneOverROI(o, nodeBestROI);
			}
		}

		// Check if best action is worth it.
		if (bestROI < cutoffTime) {
			ns.print(
				`Info - Best action: ${Object.keys(actions).find(
					(key) => actions[key] === bestAction
				)}, with an increase of ${ns.nFormat(
					bestIncrease,
					"0.0a"
				)}/s, cost of ${ns.nFormat(
					bestCost,
					"0.00a"
				)} and ROI of ${ns.nFormat(bestROI, "00:00:00")}(HH:MM:SS)`
			);
			if (bestAction == actions.purchaseNode) {
				await purchaseNode(bestCost);
			} else if (bestAction == actions.upgradeLevel) {
				await upgradeLevel(bestCost, bestNodeIndex);
			} else if (bestAction == actions.upgradeRam) {
				await upgradeRam(bestCost, bestNodeIndex);
			} else if (bestAction == actions.upgradeCore) {
				await upgradeCore(bestCost, bestNodeIndex);
			} else {
				consoleWarn(
					`Error! Unexpected best action! ActionIndex: ${bestAction} - Action: ${Object.keys(
						actions
					).find((key) => actions[key] === bestAction)}.`
				);
			}
			if (bestNodeIndex != -1) {
				pruneComplete(bestNodeIndex);
			}
		}
		await ns.sleep(sleepPurchaseTimeout);
	}
	consoleWarn(
		`Info - Exhausted all Node purchases that were under the ROI time cutoff of ${hours} hours. Closing script.`
	);
	consoleWarn("Exiting...");
}
