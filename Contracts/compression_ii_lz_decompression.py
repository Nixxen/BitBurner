# Compression II: LZ Decompression
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# Lempel-Ziv (LZ) compression is a data compression technique which encodes
# data using references to earlier parts of the data. In this variant of LZ,
# data is encoded in two types of chunk. Each chunk begins with a length L,
# encoded as a single ASCII digit from 1 - 9, followed by the chunk data, which
# is either:
#
# 1. Exactly L characters, which are to be copied directly into the
#    uncompressed data.
# 2. A reference to an earlier part of the uncompressed data. To do this, the
#    length is followed by a second ASCII digit X: each of the L output
#    characters is a copy of the character X places before it in the
#    uncompressed data.
#
# For both chunk types, a length of 0 instead means the chunk ends immediately,
# and the next character is the start of a new chunk. The two chunk types
# alternate, starting with type 1, and the final chunk may be of either type.

# You are given the following LZ-encoded string:
#     9F78CK6MPo09ZqJUaQnpt041kkc176YCA8Q3770651l940434WTlD4967TkklQ
# Decode it and output the original string.

# Example: decoding '5aaabb450723abb' chunk-by-chunk
#     5aaabb           ->  aaabb
#     5aaabb45         ->  aaabbaaab
#     5aaabb450        ->  aaabbaaab
#     5aaabb45072      ->  aaabbaaababababa
#     5aaabb450723abb  ->  aaabbaaababababaabb


from itertools import islice
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
        input_pairs = [
            ("5aaabb", "aaabb"),
            ("5aaabb45", "aaabbaaab"),
            ("5aaabb450", "aaabbaaab"),
            ("5aaabb45072", "aaabbaaababababa"),
            ("5aaabb450723abb", "aaabbaaababababaabb"),
            (
                "9F78CK6MPo09ZqJUaQnpt041kkc176YCA8Q3770651l940434WTlD4967TkklQ",
                "F78CK6MPoZqJUaQnpt1kkcnYCA8Q3nYCA8Q3CA8Q3ClQ3ClQ3ClQClQCWTlDQClQ7TkklQ",
            ),
        ]
        for input_pair in input_pairs:
            input_string = input_pair[0]
            expected_output = input_pair[1]
            actual_output = decompress(input_string)
            print(f"Input: {input_string}")
            print(f"Expected output: {expected_output}")
            print(f"Actual output: {actual_output}")
            assert (
                actual_output == expected_output
            ), "Output does not match expected output"
            print()
    else:
        input_string = "9F78CK6MPo09ZqJUaQnpt041kkc176YCA8Q3770651l940434WTlD4967TkklQ"
        print(f"Decompressed string: {decompress(input_string)}")


def decompress(input_string: str) -> str | None:
    """Decompress a LZ-encoded string
    Args:
        input_string (str): LZ-encoded string
    Returns:
        str: Decompressed string
    """
    output_string = ""
    chunk_type = 1
    chunks = iter(enumerate(input_string))
    for i, character in chunks:
        # Incorrect input errors
        if not character.isdigit():
            debug(f"Invalid character: {character}")
            return None
        # Done with final chunk
        if i >= len(input_string):
            debug("Done with final chunk")
            break

        if chunk_type == 1:
            debug(f"Processing type 1 chunk, character {character}")
            if int(character) + i >= len(input_string):
                debug(f"Invalid chunk length for type 1: {character}")
                return None
            # 0 is already handled by character, so can skip that logic here
            output_string += input_string[i + 1 : int(character) + i + 1]
            debug(f"\tOutput string: {output_string}")
            # Skip to the next chunk (skipping with the value of character)
            next(islice(chunks, int(character), int(character)), None)
            chunk_type = 2
        elif chunk_type == 2:
            distance = int(character)
            debug(f"Processing type 2 chunk, distance {distance}")
            if distance == 0:
                # Skip to the next chunk (0 character)
                chunk_type = 1
                continue
            else:
                # Incorrect input error
                if i + 1 >= len(input_string):
                    debug(
                        f"Reached end of input string, i+1 is: {i+1}, length is: {len(input_string)}distance is: {distance}"
                    )
                    return None
                if not input_string[i + 1].isdigit():
                    debug(f"Invalid character: {input_string[i + 1]}")
                    return None
                offset = int(input_string[i + 1])
                debug(f"\tOffset is: {offset}")
                if offset > len(output_string):
                    debug(f"Invalid offset: {offset}")
                    return None
                for i in range(distance):
                    output_string += output_string[len(output_string) - offset]
                debug(f"\tOutput string: {output_string}")
                # Skip to the next chunk (1 character)
                next(islice(chunks, 1, 1), None)
            chunk_type = 1
    return output_string


if __name__ == "__main__":
    main()
