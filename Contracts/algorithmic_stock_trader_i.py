# Algorithmic Stock Trader I
#
# You are attempting to solve a Coding Contract. You have 5 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following array of stock prices (which are numbers) where
# the i-th element represents the stock price on day i:
#
# 182,60,90,109,28,39,186,70,68,122,18,177,34,173,147,6
#
# Determine the maximum possible profit you can earn using at most one
# transaction (i.e. you can only buy and sell the stock once). If no profit can
# be made then the answer should be 0. Note that you have to buy the stock
# before you can sell it


def get_max_profit(prices: list) -> int:
    """
    Args:
        prices (list): List of stock prices
    Returns:
        int: Maximum possible profit
    """
    if len(prices) < 2:
        return 0
    min_price = prices[0]
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit


def main():
    prices = [182, 60, 90, 109, 28, 39, 186, 70, 68, 122, 18, 177, 34, 173, 147, 6]
    result = get_max_profit(prices)
    print(result)


if __name__ == "__main__":
    main()
