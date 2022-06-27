# Proper 2-Coloring of a Graph
#
# You are attempting to solve a Coding Contract. You have 5 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following data, representing a graph:
#  [13,[[2,4],[1,3],[9,11],[0,5],[2,7],[5,6],[4,5],[9,12],[6,8],[1,4],[3,5],[3,8],[3,9],[7,11],[0,1],[2,3],[6,7],[4,8],[7,12],[2,11],[4,7],[7,10]]]
# Note that "graph", as used here, refers to the field of graph theory, and has
# no relation to statistics or plotting. The first element of the data
# represents the number of vertices in the graph. Each vertex is a unique
# number between 0 and 12. The next element of the data represents the edges of
# the graph. Two vertices u,v in a graph are said to be adjacent if there
# exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u],
# as order does not matter. You must construct a 2-coloring of the graph,
# meaning that you have to assign each vertex in the graph a "color", either 0
# or 1, such that no two adjacent vertices have the same color. Submit your
# answer in the form of an array, where element i represents the color of
# vertex i. If it is impossible to construct a 2-coloring of the given graph,
# instead submit an empty array.

# Examples:
#
# - Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
# - Output: [0, 0, 1, 1]
# - Input: [3, [[0, 1], [0, 2], [1, 2]]]
# - Output: []

from collections import defaultdict


def main():
    testing = True
    if testing:
        input_pairs = [
            ([4, [[0, 2], [0, 3], [1, 2], [1, 3]]], [0, 0, 1, 1]),
            ([3, [[0, 1], [0, 2], [1, 2]]], []),
        ]
        for input_pair in input_pairs:
            input_graph = input_pair[0]
            expected_output = input_pair[1]
            actual_output = two_color_graph(input_graph)
            print(f"Input: {input_graph}")
            print(f"Expected output: {expected_output}")
            print(f"Actual output: {actual_output}")
            assert actual_output == expected_output
            print()
    else:
        input_graph = [
            13,
            [
                [2, 4],
                [1, 3],
                [9, 11],
                [0, 5],
                [2, 7],
                [5, 6],
                [4, 5],
                [9, 12],
                [6, 8],
                [1, 4],
                [3, 5],
                [3, 8],
                [3, 9],
                [7, 11],
                [0, 1],
                [2, 3],
                [6, 7],
                [4, 8],
                [7, 12],
                [2, 11],
                [4, 7],
                [7, 10],
            ],
        ]
        print(f"2-coloring of graph: {two_color_graph(input_graph)}")


def two_color_graph(input_graph):
    """2-coloring of a graph.

    Args:
        input_graph (list): Input graph

    Returns:
        list: 2-coloring of the graph
    """
    vertex_colors = defaultdict(lambda: "Not colored")
    for vertex in range(input_graph[0]):
        vertex_colors[vertex] = "Not colored"
    # TODO: Implement DFS of the graph
    for edge in input_graph[1]:
        if vertex_colors[edge[0]] == vertex_colors[edge[1]]:
            return []
        else:
            if (
                vertex_colors[edge[0]] == "Not colored"
                and vertex_colors[edge[1]] == "Not colored"
            ):
                vertex_colors[edge[0]] = 0
                vertex_colors[edge[1]] = 1
            elif vertex_colors[edge[0]] == "Not colored":
                vertex_colors[edge[0]] = int(not vertex_colors[edge[1]])
            elif vertex_colors[edge[1]] == "Not colored":
                vertex_colors[edge[1]] = int(not vertex_colors[edge[0]])
    return [vertex_colors[vertex] for vertex in range(input_graph[0])]


if __name__ == "__main__":
    main()
