/** @param {NS} ns */
export async function main(ns) {
	const arr = ["A", "B", "C", "D"]
	for (let i in arr){
		ns.tprint("for...in: " + i)
	}
	for (let i of arr){
		ns.tprint("for...of: " + i)
	}

	ns.tprint("Range(0:5): " + ([...Array(5).keys()]))

	const actions = {
		none: -1,
		purchaseNode: 0,
		upgradeLevel: 1,
		upgradeRam: 2,
		upgradeCore: 3
	}
	ns.tprint("Enum array: " + Object.values(actions))
	ns.tprint("Enum array: " + [...Array(Object.values(actions))])
	ns.tprint("Enum array: " + [...Array(Object.values(actions))].length)
	ns.tprint("Enum array: " + [...Array([...Array(Object.values(actions))].length-1)])
	const staticArray = [...Array(Object.values(actions))]
	ns.tprint("Static: "+ staticArray)
	ns.tprint("Length of static: "+ staticArray.length)
	const staticArrayKeys = [...Array(Object.keys(actions))]
	ns.tprint("Static: "+ staticArrayKeys)
	ns.tprint("Length of static: "+ staticArrayKeys.length)
	
	function* range(start=0, end=null, step=1) {
		if (end == null) {
			end = start;
			start = 0;
		}

		for (let i=start; i < end; i+=step) {
			yield i;
		}
	}

	ns.tprint("Generator(5): " + range(5)) // Makes an object...

	for (let num of range(5)) ns.tprint("Generator(5) of: " + num);
	for (let num of range(5,20)) ns.tprint("Generator(5:20) of: " + num);
	for (let num of range(5,20,2)) ns.tprint("Generator(5:20:2) of: " + num);

	// for ... in generator does not work
	for (let num in range(5)) ns.tprint("Generator(5) in : " + num);
	for (let num in range(5,20)) ns.tprint("Generator(5:20) in : " + num);
	for (let num in range(5,20,2)) ns.tprint("Generator(5:20:2) in : " + num);


}