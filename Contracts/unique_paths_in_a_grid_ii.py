# Unique Paths in a Grid II You are attempting to solve a Coding Contract. You
# have 10 tries remaining, after which the contract will self-destruct.
#
# You are located in the top-left corner of the following grid:

# 0,0,0,1,1,0,0,
# 0,0,0,0,0,0,0,
# 0,0,1,0,1,0,0,
# 1,0,1,0,0,0,0,
# 0,0,0,0,0,0,0,
# 0,0,1,0,0,0,0,

# You are trying reach the bottom-right corner of the grid, but you can only
# move down or right on each step. Furthermore, there are obstacles on the grid
# that you cannot move onto. These obstacles are denoted by '1', while empty
# spaces are denoted by 0.
#
# Determine how many unique paths there are from start to finish.
#
# NOTE: The data returned for this contract is an 2D array of numbers
# representing the grid.

from collections import defaultdict


def main():
    grid = [
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
    ]
    start_pos = [0, 0]
    goal_pos = [len(grid) - 1, len(grid[0]) - 1]
    unique_paths = defaultdict(lambda: 0)
    blocking_symbols = [1]
    print(get_unique_paths_blocking(grid, start_pos, goal_pos, blocking_symbols, unique_paths))


def get_unique_paths_blocking(grid: list, start_position: list, end_position: list, blocking_symbols: list, unique_paths: dict) -> int:
    """Unique paths from start to finish in a grid with row rows and col columns.

    Args:
        grid (list): 2D array of numbers representing the grid
        start_position (list): Start position in the grid
        end_position (list): End position in the grid
        blocking_symbols (list): List of symbols that represent blocking cells
        unique_paths (dict): Dictionary of unique paths from start to finish

    Returns:
        int: Number of unique paths from start to finish
    """
    # If we have reached the end, return 1
    if start_position == end_position:
        return 1
    # If we are out of bounds, return 0
    if (start_position[0] < 0
        or start_position[1] < 0
        or start_position[0] > len(grid) - 1
        or start_position[1] > len(grid[0]) - 1):
        return 0
    # If the current position is a blocking symbol, return 0
    if grid[start_position[0]][start_position[1]] in blocking_symbols:
        return 0
    # If we have already calculated this path, return it
    if unique_paths[(start_position[0], start_position[1])] != 0:
        return unique_paths[(start_position[0], start_position[1])]
    unique_paths[(start_position[0], start_position[1])] = get_unique_paths_blocking(
        grid,
        [start_position[0] + 1, start_position[1]],
        end_position,
        blocking_symbols,
        unique_paths
    ) + get_unique_paths_blocking(
        grid,
        [start_position[0], start_position[1] + 1],
        end_position,
        blocking_symbols,
        unique_paths
    )
    return unique_paths[(start_position[0], start_position[1])]



if __name__ == "__main__":
    main()