# Shortest Path in a Grid
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# You are located in the top-left corner of the following grid:

#   [[0,0,0,0,0,0,0,1,0,1],
#    [1,1,0,1,0,0,1,1,0,1],
#    [1,0,1,1,0,0,0,0,0,1],
#    [0,0,0,0,1,1,0,1,1,1],
#    [0,0,0,0,0,0,0,0,1,1],
#    [0,0,0,0,0,0,0,0,0,0],
#    [0,0,0,0,1,0,0,0,0,0],
#    [1,1,0,0,0,0,0,0,1,0]]

# You are trying to find the shortest path to the bottom-right corner of the
# grid, but there are obstacles on the grid that you cannot move onto. These
# obstacles are denoted by '1', while empty spaces are denoted by 0.
#
# Determine the shortest path from start to finish, if one exists. The answer
# should be given as a string of UDLR characters, indicating the moves along
# the path
#
# NOTE: If there are multiple equally short paths, any of them is accepted as
# answer. If there is no path, the answer should be an empty string. NOTE: The
# data returned for this contract is an 2D array of numbers representing the
# grid.
#
# Examples:
#
#     [[0,1,0,0,0],
#      [0,0,0,1,0]]
#
# Answer: 'DRRURRD'
#
#     [[0,1],
#      [1,0]]
#
# Answer: ''

from collections import defaultdict
from queue import PriorityQueue
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
    """Note: Standard input is a 2D array of numbers representing the grid
    following x-axis downwards along the rows and y-axis towards the right,
    along the columns. Meaning the top-left corner of the grid is (0, 0). e.g.
    +------------------------------> y
    |(0,0)|(0,1)|(0,2)|(0,3)|(0,4)|
    |(1,0)|(1,1)|(1,2)|(1,3)|(1,4)|
    |(2,0)|(2,1)|(2,2)|(2,3)|(2,4)|
    v
    x
    """
    testing = False
    blocking_symbols = [1]
    if testing:
        # fmt: off
        grids = (
            [
                [0, 1, 0, 0, 0],
                [0, 0, 0, 1, 0]
            ],
            [
                [0, 1],
                [1, 0]
            ]
        )
        # fmt: on
        answers = ("DRRURRD", "")
        for grid, answer in zip(grids, answers):
            print("\nGrid:")
            print_grid(grid)
            start_position = (0, 0)  # Top left
            goal_position = (len(grid) - 1, len(grid[0]) - 1)  # Bottom right
            result = get_shortest_path_blocking(
                grid, start_position, goal_position, blocking_symbols
            )
            print("\nResult:")
            print(result)
            assert result == answer, f"Expected {answer}, got {result}"
    else:
        grid = [
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        ]
        start_position = (0, 0)  # Top left
        goal_position = (len(grid) - 1, len(grid[0]) - 1)  # Bottom right
        result = get_shortest_path_blocking(
            grid, start_position, goal_position, blocking_symbols
        )
        print("\nResult:")
        print(result)


def get_heuristic(current_position: tuple, goal_position: tuple) -> int:
    """Calculates the heuristic cost of getting from current_position to goal_position
    Uses the Manhattan distance as a heuristic
    Args:
        current_position (tuple): Tuple of (x, y) coordinates of current position(node)
        goal_position (tuple): Tuple of (x, y) coordinates of goal position(node)
    Returns:
        int: Heuristic cost of getting from current_position to goal_position
    """
    return abs(current_position[0] - goal_position[0]) + abs(
        current_position[1] - goal_position[1]
    )


def reconstruct_path(came_from: dict, current_node: tuple) -> str:
    """Reconstructs the path from start to goal
    Args:
        came_from (dict): Dictionary of nodes and their parents
        current_node (tuple): Tuple of (x, y) coordinates of current node
    Returns:
        str: String of directions to get from start to goal
    """
    total_path = ""
    while current_node in came_from:
        total_path = came_from[current_node][0] + total_path
        current_node = came_from[current_node][1]
    return total_path


def get_next_position(current_position: tuple, direction: str) -> tuple:
    """Calculates the next position in the grid given the current position and direction
    Args:
        current_position (tuple): Tuple of (x, y) coordinates of current position(node)
        direction (str): Direction to move in
    Returns:
        tuple: Tuple of (x, y) coordinates of next position(node)
    """
    if direction == "U":  # Up, x - 1
        return (current_position[0] - 1, current_position[1])
    elif direction == "D":  # Down, x + 1
        return (current_position[0] + 1, current_position[1])
    elif direction == "L":  # Left, y - 1
        return (current_position[0], current_position[1] - 1)
    elif direction == "R":  # Right, y + 1
        return (current_position[0], current_position[1] + 1)
    else:
        raise ValueError(f"Invalid direction: {direction}")


def is_valid_position(position: tuple, grid: list, blocking_symbols: list) -> bool:
    """Checks if the position is valid
    Args:
        position (tuple): Tuple of (x, y) coordinates of position(node)
        grid (list): 2D array of numbers representing the grid
        blocking_symbols (list): List of symbols that are blocking
    Returns:
        bool: True if position is valid, False otherwise
    """
    if position[0] < 0 or position[1] < 0:
        debug(f"\tOut of bounds {position}")
        return False
    if position[0] >= len(grid) or position[1] >= len(grid[0]):
        debug(f"\tOut of bounds {position}")
        return False
    if grid[position[0]][position[1]] in blocking_symbols:  # x is row, y is column
        debug(f"\tBlocking symbol {grid[position[0]][position[1]]} at {position}")
        debug(grid, position, func=print_grid)
        return False
    return True


def print_grid(grid: list, position: tuple = (-1, -1)) -> None:
    """Prints the grid
    Args:
        grid (list): 2D array of numbers representing the grid
        position (tuple): Tuple of (x, y) coordinates of position(node)
    """
    if position != (-1, -1):
        grid[position[0]][position[1]] = "*"
    print("\n".join(["".join([str(x) for x in row]) for row in grid]))


def get_shortest_path_blocking(
    grid: list, start_position: tuple, goal_position: tuple, blocking_symbols: list
) -> str:
    """Uses AStar to traverse the grid, finding the shortest path from
    start_position to goal_position
    Args:
        grid (list): 2D array of numbers representing the grid
        start_position (tuple): Tuple of (x, y) coordinates of start position(node)
        goal_position (tuple): Tuple of (x, y) coordinates of goal position(node)
        blocking_symbols (list): List of symbols that are blocking
    Returns:
        str: Shortest path from start to goal
    """
    # Valid directions
    directions = ["U", "D", "L", "R"]

    # Queue for the next positions to check (using priority queue), starting
    # with start_position
    open_positions = PriorityQueue()
    open_positions.put((0, start_position))

    # Set of visited positions (to avoid infinite loops)
    visited_positions = set()

    # A map of the cheapest path back from each position(node) to the previous
    # position, represented as a list of a direction and the previous position
    # e.g. ['U', [x, y]]
    came_from = defaultdict(lambda: None)

    # A map that tracks cost of getting from start to current node, with
    # default value of infinity
    current_cost = defaultdict(lambda: float("inf"))
    current_cost[start_position] = 0

    # Map current best guess from start to goal through current node,
    # calculated by current_cost + heuristic. Default value of infinity
    full_cost = defaultdict(lambda: float("inf"))
    full_cost[start_position] = current_cost[start_position] + get_heuristic(
        start_position, goal_position
    )

    while not open_positions.empty():
        current_position = open_positions.get()[1]
        if current_position == goal_position:
            return reconstruct_path(came_from, current_position)
        if current_position in visited_positions:
            continue
        visited_positions.add(current_position)
        for direction in directions:
            next_position = get_next_position(current_position, direction)
            debug(
                f"Current position: {current_position}, direction: {direction}, Next position: {next_position}"
            )
            if not is_valid_position(next_position, grid, blocking_symbols):
                continue
            new_cost = (
                current_cost[current_position] + 1
            )  # 1 is the cost of moving to next position
            debug(f"New cost: {new_cost}")
            if new_cost < current_cost[next_position]:
                debug(f"New cost is less than current cost")
                current_cost[next_position] = new_cost
                full_cost[next_position] = new_cost + get_heuristic(
                    next_position, goal_position
                )
                came_from[next_position] = [direction, current_position]
                open_positions.put((full_cost[next_position], next_position))
    debug(f"No path found from {start_position} to {goal_position}")
    return ""


if __name__ == "__main__":
    main()
