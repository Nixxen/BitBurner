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


from collections import defaultdict, deque
from typing import Callable


DEBUGGING = False


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
    testing = False
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
        array = [int(x) for x in input("Enter array: ").split(",")]
        result = minimum_jumps(array)
        print(f"Minimum jumps: {result}")


def minimum_jumps(array: list) -> int:
    """Find the minimum number of jumps to reach the end of the array, using
    a bastardized DFS.
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
        next_potentials = []
        for i in range(
            current_position + 1, current_position + array[current_position] + 1
        ):
            debug(f"\tChecking position {i}")
            if i >= len(array):
                break
            if not visited[i]:
                next_potentials.append((i, array[i]))
        best_potential = current_position
        best_next_position = 0
        for next_position, next_value in next_potentials:
            if next_value + next_position > best_potential:
                best_potential = next_value + next_position
                best_next_position = next_position
        if best_next_position == current_position:
            debug("\tNo valid next positions")
            continue
        stack.append(best_next_position)
        visited[best_next_position] = True
        current_path_length += 1
    return shortest_path_length if shortest_path_length != float("inf") else 0


if __name__ == "__main__":
    main()
