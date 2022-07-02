# Algorithmic Stock Trader II
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following array of stock prices (which are numbers) where
# the i-th element represents the stock price on day i:
#
# 82,176,127,49
#
# Determine the maximum possible profit you can earn using as many transactions
# as you'd like. A transaction is defined as buying and then selling one share
# of the stock. Note that you cannot engage in multiple transactions at once.
# In other words, you must sell the stock before you buy it again.
#
# If no profit can be made, then the answer should be 0


def main():
    testing = False
    if testing:
        stock_prices = [12, 10, 14, 16, 5, 8, 6, 7, 5]
        answer = 10
        result = get_max_profit(stock_prices, len(stock_prices))
        assert result == answer, f"Expected {answer}, got {result}"
        print("Test passed")
    else:
        stock_prices = [82, 176, 127, 49]
        result = get_max_profit(stock_prices, len(stock_prices))
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
