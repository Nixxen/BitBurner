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


def inject_parity_bits(binary_value: str, parity_bits: int) -> str:
    """Injects parity_bits amount of blank parity bits into the binary value
        at every power of 2
    Args:
        binary_value(str): The binary value to inject the parity bits into
        parity_bits(int): The number of empty parity bits to inject
    Returns:
        (str) The binary value with the injected parity bits
    """
    output = "00"  # Injecting two blank bits at the start
    offset = len(output)  # For finding the correct index in the normal binary value
    length = len(binary_value)
    print(str(binary_value))
    for i in range(2, length + parity_bits + 1):
        if math.log2(i).is_integer():
            debug(f"Parity bit at index {i}")
            output += "0"
            offset += 1
        else:
            debug(f"Data bit at index {i}, updated i: {i - offset}")
            output += binary_value[i - offset]
    return output


def flip_parity_bit(binary_value: str, index: int) -> str:
    """Flips the parity bit at the given index
    Args:
        binary_value(str): The binary value to flip the parity bit in
        index(int): The index of the parity bit to flip
    Returns:
        (str) The binary value with the flipped parity bit
    """
    # Get the parity bit at the given index
    parity_bit = binary_value[index]
    # Flip the parity bit
    if parity_bit == "0":
        binary_value = binary_value[:index] + "1" + binary_value[index + 1 :]
    else:
        binary_value = binary_value[:index] + "0" + binary_value[index + 1 :]
    return binary_value


def parity_bit_check(binary_value: str, index: int) -> str:
    """Do a binary check for the binary value relating to the given parity bit index
    Args:
        binary_value(str): The binary value to check
        index(int): The index of the parity bit that determines which part of the
            binary value to check
    Returns:
        (str) The binary value with parity bit flipped (if needed)
    """
    # Generalize these rules somehow:
    # 0: Overall parity of the entire binary value
    # 1: every even column (when 1-indexed)
    # 2: every 3-4th column, repeating (when 1-indexed)
    # 4: every even row (when 1-indexed)
    # 8: every 3-4th row, repeating (when 1-indexed)
    # 16: every 5-8th column, repeating (when 1-indexed)
    # 32: every 5-8th row, repeating (when 1-indexed)
    # 64: every 9-16th column, repeating (when 1-indexed)
    # 128: every 9-16th row, repeating (when 1-indexed)
    # 256: every 17-32th column, repeating (when 1-indexed)
    # 512: every 17-32th row, repeating (when 1-indexed)

    # TODO: Get the relevant part of the binary value to check
    check_value = binary_value[index:]

    # Get the number of 1's in the binary value
    ones = sum([1 for bit in check_value if bit == "1"])
    # Flip the parity bit if needed
    if ones % 2 != 0:
        binary_value = flip_parity_bit(binary_value, index)
    return binary_value


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

    binary_value = bin(value)[2:]  # Remove the '0b' prefix
    length = len(binary_value)
    # Get the number of parity bits (not including overall bit)
    parity_bits = get_total_parity_bits(length)
    # Inject blank parity bits in every power of 2 in the binary value
    binary_value = inject_parity_bits(binary_value, parity_bits)
    # Check the parity bits and flip if needed
    for i in range(1, parity_bits + 1):
        binary_value = parity_bit_check(binary_value, i)
    # Check the overall parity bit check
    binary_value = parity_bit_check(binary_value, 0)
    return binary_value


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
