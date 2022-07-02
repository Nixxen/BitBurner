# Find All Valid Math Expressions
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following string which contains only digits between 0 and
# 9:
#
# 30745
#
# You are also given a target number of 32. Return all possible ways you can
# add the +(add), -(subtract), and *(multiply) operators to the string such
# that it evaluates to the target number. (Normal order of operations applies.)
#
# The provided answer should be an array of strings containing the valid
# expressions. The data provided by this problem is an array with two elements.
# The first element is the string of digits, while the second element is the
# target number:
#
# ["30745", 32]
#
# NOTE: The order of evaluation expects script operator precedence NOTE:
# Numbers in the expression cannot have leading 0's. In other words, "1+01" is
# not a valid expression Examples:

# Input: digits = "123", target = 6
# Output: [1+2+3, 1*2*3]

# Input: digits = "105", target = 5
# Output: [1*0+5, 10-5]


# TODO: Implement the algorithm. Work in progress.


def main():
    testing = True
    if testing:
        numbers = [
            ["123", 6],
            ["105", 5],
        ]
        answers = [
            ["1+2+3", "1*2*3"],
            ["1*0+5", "10-5"],
        ]
        for number, answer in zip(numbers, answers):
            result = find_all_valid_math_expressions(number[0], number[1])
            assert result == answer, f"Expected {answer}, got {result}"
        print("Test passed")
    else:
        number = ["30745", 32]
        result = find_all_valid_math_expressions(number[0], number[1])
        print(result)


def find_all_valid_math_expressions(digits: str, target: int) -> list:
    """Find all valid math expressions.
    Args:
        digits (str): String of digits
        target (int): Target number
    Returns:
        list: List of valid math expressions
    """
    print(f"Digits: {digits}, Target: {target}")

    if len(digits) == 0:
        return []
    if len(digits) == 1:
        if int(digits) == target:
            return digits
        else:
            return []
    if int(digits) == target:
        return [digits]
    # if int(digits) > target:
    #     return []
    # if int(digits) < target:
    return f"{digits[0]}+{find_all_valid_math_expressions(digits[1:], target-int(digits[0]))}"


if __name__ == "__main__":
    main()
