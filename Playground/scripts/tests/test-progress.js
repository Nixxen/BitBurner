/** @param {NS} ns */
export async function main(ns) {
	const interval = 10000; //10 seconds
    let prevTime = ns.getTimeSinceLastAug() + interval;
    while (true) {
        if (prevTime + interval < ns.getTimeSinceLastAug()) {
            doStuff();
            prevTime = ns.getTimeSinceLastAug();
        }
        updateTail();
        await ns.sleep(10);
    }

    function updateTail() {
        ns.clearLog();
        ns.print("=============Servers============")
        ns.print("Home ram: " + ns.getServerMaxRam("home") + "GB");
        for (let i = 0; i < 5; i++) {
            if (i < 3) ns.print(")) Placeholder ((");
            else ns.print("");
        }
    }

    function doStuff(){
        ns.print("This is a test");
    }
}