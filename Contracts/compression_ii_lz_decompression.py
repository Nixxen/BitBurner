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


from time import sleep


def main():
    testing = False
    if testing:
        input_pairs = [
            ("5aaabb", "aaabb"),
            ("5aaabb45", "aaabbaaab"),
            ("5aaabb450", "aaabbaaab"),
            ("5aaabb45072", "aaabbaaababababa"),
            ("5aaabb450723abb", "aaabbaaababababaabb"),
        ]
        for input_pair in input_pairs:
            input_string = input_pair[0]
            expected_output = input_pair[1]
            actual_output = decompress(input_string)
            print(f"Input: {input_string}")
            print(f"Expected output: {expected_output}")
            print(f"Actual output: {actual_output}")
            assert actual_output == expected_output
            print()
    else:
        input_string = "9F78CK6MPo09ZqJUaQnpt041kkc176YCA8Q3770651l940434WTlD4967TkklQ"
        print(f"Decompressed string: {decompress(input_string)}")


def decompress(input_string):
    output_string = ""
    given_length = int(input_string[0])
    if given_length == 0:
        return output_string
    data = input_string[1:]
    if given_length == len(data):
        return data
    else:
        output_string += data[:given_length]
        data = data[given_length:]
        print(f"Base Output string: {output_string}")
        print(f"Base Data: {data}")
        while len(data) > 0:
            given_length = int(data[0])
            print(f"Given length: {given_length}")
            print(f"Data: {data}")
            data = data[1:]
            if given_length == 0:
                continue
            if data[0].isalpha() and given_length == len(data):
                output_string += data
                data = ""
            else:
                backtrack = int(data[0])
                print(f"Backtrack: {backtrack}")
                data = data[1:]
                while given_length > backtrack:
                    output_string += output_string[-backtrack:]
                    given_length -= backtrack
                print(
                    f"Output string: {output_string} - Given length: {given_length} - backtrack: {backtrack}"
                )
                output_string += output_string[-backtrack : -(backtrack - given_length)]
                print(
                    f"Trunctuated Output string: {output_string[-backtrack:-(backtrack-given_length)]}"
                )
        return output_string


if __name__ == "__main__":
    main()
