/** @param {NS} ns */
export async function main(ns) {
	// Gets the combined value of all the stocks the player has invested in.

    const sumStocks = (...args) => {
        return args.reduce((total, ticker) => {
            let pos = ns.stock.getPosition(ticker);
            if (pos[0]){
                return total += Math.floor(pos[0] * pos[1])
            } else return total
        }, 0)
    }

    let sum = sumStocks(...ns.stock.getSymbols());
    ns.tprint("Sum of all stocks: " + ns.nFormat(sum, '($ 0.00 a)'));
}