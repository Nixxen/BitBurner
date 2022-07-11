# Sanitize Parentheses in Expression
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# Given the following string:
#
# (a)a(a()a((()a)
#
# remove the minimum number of invalid parentheses in order to validate the
# string. If there are multiple minimal ways to validate the string, provide
# all of the possible results. The answer should be provided as an array of
# strings. If it is impossible to validate the string the result should be an
# array with only an empty string.
#
# IMPORTANT: The string may contain letters, not just parentheses. Examples:
#  - "()())()" -> [()()(), (())()]
#  - "(a)())()" -> [(a)()(), (a())()]
#  - ")(" -> [""]

from collections import defaultdict, deque
import logging

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)


def main():
    testing = False
    if testing:
        # fmt: off
        strings = [
            "()())()",
            "(a)())()",
            ")(",
            "())))((a))(a)())"
        ]
        answers = [
            ["()()()", "(())()"],
            ["(a)()()", "(a())()"],
            [""],
            ['()((a))(a)()', '()((a))(a())', '(((a))(a)())', '()((a)(a)())'],
        ]
        # fmt: on
        for string, answer in zip(strings, answers):
            result = sanitize_parenthesis_in_expression(string)
            print(f"Tested string {string}")
            print(f"Expected result: \t{set(answer)}")
            print(f"Actual result: \t\t{set(result)}")
            assert set(result) == set(answer)
            print("Passed!")
    else:
        string = input("Enter string: ")
        result = sanitize_parenthesis_in_expression(string)
        result = "[" + (", ".join(result) if len(result) > 0 else "") + "]"
        print(f"Result: {result}")


def sanitize_parenthesis_in_expression(string: str) -> list:
    """Removes the minimum number of invalid parentheses in order to validate the
    string. Uses BFS to find the minimum number of invalid parentheses.
    Args:
        string (str): String to sanitize
    Returns:
        list: List of strings that are valid
    """
    stack = deque()
    stack.append(string)
    visited = defaultdict(bool)
    visited[string] = True
    valid = []
    while stack:
        current = stack.pop()
        if is_valid(current):
            valid.append(current)
        for i, char in enumerate(current):
            if char == "(" or char == ")":
                if i != len(current):
                    new_string = current[:i] + current[i + 1 :]
                else:
                    new_string = current[:i]
                if new_string not in visited:
                    stack.append(new_string)
                    visited[new_string] = True
    valid.sort(key=len, reverse=True)
    logger.info("Valid: %s", valid)
    results = [x for x in valid if len(x) > 0 and len(x) == len(valid[0])]
    return results if len(results) > 0 else [""]


def is_valid(string: str) -> bool:
    """Checks if the string is valid.
    Args:
        string (str): String to check
    Returns:
        bool: True if valid, False otherwise
    """
    count = 0
    for char in string:
        if char == "(":
            count += 1
        elif char == ")":
            count -= 1
        if count < 0:
            return False
    return count == 0


if __name__ == "__main__":
    main()
