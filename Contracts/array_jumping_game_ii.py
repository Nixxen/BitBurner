# Array Jumping Game II
#
# You are attempting to solve a Coding Contract. You have 3 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following array of integers:
#
# 2,3,3,1,3,3,3,5,2,1,1,1,4,1,3,2,3,0
#
# Each element in the array represents your MAXIMUM jump length at that
# position. This means that if you are at position i and your maximum jump
# length is n, you can jump to any position from i to i+n.
#
# Assuming you are initially positioned at the start of the array, determine
# the minimum number of jumps to reach the end of the array.
#
# If it's impossible to reach the end, then the answer should be 0.

# TODO: Implement the algorithm


from collections import defaultdict, deque
from typing import Callable


DEBUGGING = True


def debug(*args, func: Callable = None) -> None:
    """Prints a message if debugging is enabled
    Args:
        message (str): Message to print
    """
    if DEBUGGING:
        if func:
            func(*args)
        else:
            print(*args)


def main():
    testing = True
    if testing:
        arrays = [
            [2, 0, 0, 0],
            [2, 1, 1, 1],
            [1, 1, 1],
            [3, 0, 0],
            [3, 0, 0, 0],
            [3, 0, 0, 0, 0],
            [3, 0, 1],
            [3, 0, 1, 1],
            [3, 0, 1, 1, 1],
            [2, 3, 3, 1, 3, 3, 3, 5, 2, 1, 1, 1, 4, 1, 3, 2, 3, 0],
        ]
        answers = [
            0,
            2,
            2,
            1,
            1,
            0,
            1,
            1,
            2,
            6,
        ]
        for array, answer in zip(arrays, answers):
            print(f"Testing with array {array}")
            result = minimum_jumps(array)
            assert result == answer, f"Expected {answer}, got {result}"
            print("Test passed")
    else:
        array = [2, 3, 3, 1, 3, 3, 3, 5, 2, 1, 1, 1, 4, 1, 3, 2, 3, 0]
        result = minimum_jumps(array)
        print(result)


def minimum_jumps(array: list) -> int:
    """Find the minimum number of jumps to reach the end of the array, using DFS.
    Args:
        array (list): Array of integers
    Returns:
        int: Minimum number of jumps
    """
    stack = deque()
    current_position = 0
    stack.append(current_position)
    visited = defaultdict(bool)
    visited[current_position] = True
    shortest_path_length = float("inf")
    current_path_length = 0
    while stack:
        current_position = stack.pop()
        debug(
            f"Current position: {current_position}, current value {array[current_position]}"
        )
        if current_position == len(array) - 1:
            current_path_length = current_path_length - len(stack)
            debug(
                f"Found end of array at position {current_position}, with {current_path_length} jumps completed"
            )
            shortest_path_length = min(shortest_path_length, current_path_length)
            continue
        for i in range(
            current_position + 1, current_position + array[current_position] + 1
        ):
            debug(f"\tChecking position {i}")
            if i >= len(array):
                continue
            if not visited[i]:
                debug(f"\t\tAdding position {i} to stack")
                stack.append(i)
                visited[i] = True
                current_path_length += 1
    return shortest_path_length if shortest_path_length != float("inf") else 0


if __name__ == "__main__":
    main()
