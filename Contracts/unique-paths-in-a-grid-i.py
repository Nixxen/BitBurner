# Unique Paths in a Grid I
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct. You are in a grid with 6 rows
# and 13 columns, and you are positioned in the top-left corner of that grid.
# You are trying to reach the bottom-right corner of the grid, but you can only
# move down or right on each step. Determine how many unique paths there are
# from start to finish.
#
# NOTE: The data returned for this contract is an array with the number of rows
# and columns:
#
# [6, 13]

from collections import defaultdict


def get_unique_paths(row: int, col: int, unique_paths: dict) -> int:
    """Unique paths from start to finish in a grid with row rows and col columns.
    Logically the number of unique paths from start to finish, is the same as from
    finish to start, so we will traverse from the finish to the start.

    Args:
        row (int): Finish row
        col (int): Finish column
        unique_paths (dict): Dictionary of unique paths from start to finish

    Returns:
        int: Number of unique paths from start to finish
    """
    if row == 1 or col == 1:  # Reached "start"
        return 1
    if row < 1 or col < 1:  # Out of bounds
        return 0
    if unique_paths[(row, col)] != 0:
        return unique_paths[(row, col)]
    unique_paths[(row, col)] = get_unique_paths(
        row - 1, col, unique_paths
    ) + get_unique_paths(row, col - 1, unique_paths)
    return unique_paths[(row, col)]


def main():
    row, col = [
        int(x) for x in input("Enter row and column in format 'row col': ").split()
    ]
    unique_paths = defaultdict(lambda: 0)
    # Using 1 indexing, so no need to account for -1 on start.
    result = get_unique_paths(row, col, unique_paths=unique_paths)
    print(result)


if __name__ == "__main__":
    main()
