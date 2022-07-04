# HammingCodes: Integer to Encoded Binary
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# You are given the following decimal Value: 1056111410136
#
# Convert it into a binary string and encode it as a 'Hamming-Code'. eg: Value
# 8 will result into binary '1000', which will be encoded with the pattern
# 'pppdpddd', where p is a paritybit and d a databit, or '10101' (Value 21)
# will result into (pppdpdddpd) '1001101011'.
#
# NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit. NOTE 2:
# You should watch the HammingCode-video from 3Blue1Brown, which explains the
# 'rule' of encoding, including the first Index parity-bit mentioned on the
# first note.
#
# Now the only one rule for this encoding: It's not allowed to add additional
# leading '0's to the binary value That means, the binary value has to be
# encoded as it is

# TODO: Implement the Hamming-Code

import math
from operator import xor
from functools import reduce


def main():
    testing = False
    if testing:
        # fmt: off
        values = [
            8,
            21,
        ]
        answers = [
            '11110000',
            '1001101011',
        ]
        # fmt: on
        for value, answer in zip(values, answers):
            result = encode_hamming_code(value)
            print(f"Tested value {value}")
            print(f"Expected result: {answer}")
            print(f"Got result: {result}")
            assert result == answer, f"Expected {answer}, got {result}"
            print("Test passed")
            print("")
    else:
        value = 1056111410136
        result = encode_hamming_code(value)
        print(result)


def encode_hamming_code(value: int) -> str:
    """Encodes the given value as a Hamming-Code
    Args:
        value(int): The value to encode
    Returns:
        (str) The encoded value as a binary string
    """
    # Parity check for decoding from 3b1b:
    # reduce(xor, [i for i, bit in enumerate(bin(value)[2:]) if bit == "1"])
    # This is not what we are doing though... We are trying to encode the value

    # Convert the value to binary
    binary_value = bin(value)[2:]
    # Get the length of the binary value
    length = len(binary_value)
    # Get the square size
    square_size = length**2
    # Get the number of parity bits (not including overall bit)
    parity_bits = get_total_parity_bits(length)


def get_total_parity_bits(length: int) -> int:
    """Calculates the total number of parity bits for the given length
    Args:
        length(int): The length of the binary value
    Returns:
        (int) The total number of parity bits
    """
    if length == 0:
        return 0
    elif length < 3:
        return length + 1
    elif math.ceil(math.log2(length * 2)) <= math.ceil(
        math.log2(1 + length + math.ceil(math.log2(length)))
    ):
        return math.ceil(math.log2(length) + 1)
    else:
        return math.ceil(math.log2(length))


if __name__ == "__main__":
    main()
