# Algorithmic Stock Trader IV
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following array with two elements:
#
# [7, [55,155,154,180,32,5,147,85,167,120,141,25,84,130]]
#
# The first element is an integer k. The second element is an array of stock
# prices (which are numbers) where the i-th element represents the stock price
# on day i.
#
# Determine the maximum possible profit you can earn using at most k
# transactions. A transaction is defined as buying and then selling one share
# of the stock. Note that you cannot engage in multiple transactions at once.
# In other words, you must sell the stock before you can buy it again.
#
# If no profit can be made, then the answer should be 0.

# TODO: Implement the algorithm


def main():
    testing = False
    if testing:
        stock_prices = [2, [12, 10, 14, 16, 5, 8, 6, 7, 5]]
        answer = 9
        result = get_max_profit(stock_prices[1], stock_prices[0])
        assert result == answer, f"Expected {answer}, got {result}"
        print("Test passed")
    else:
        stock_prices = [
            7,
            [55, 155, 154, 180, 32, 5, 147, 85, 167, 120, 141, 25, 84, 130],
        ]
        result = get_max_profit(stock_prices[1], stock_prices[0])
        print(result)


def get_max_profit(stock_prices: list, transactions: int) -> int:
    """Sums the best <transactions> trades of the stock_prices list.
    Args:
        stock_prices (list): List of stock prices
        transactions (int): Number of trades allowed
    Returns:
        int: Maximum possible profit
    """

    if len(stock_prices) < 2:
        return 0
    trades = []
    min_price = stock_prices[0]
    max_price = stock_prices[0]
    profit = 0
    for price in stock_prices:
        if price < min_price:
            min_price = price
        elif price > max_price:
            max_price = price
        current_profit = price - min_price
        if current_profit > profit:
            profit = current_profit
        elif profit != 0:
            trades.append(profit)
            profit = 0
            min_price = price
            max_price = price
    trades = sorted(trades, reverse=True)[0:transactions]
    return sum(trades)


if __name__ == "__main__":
    main()
