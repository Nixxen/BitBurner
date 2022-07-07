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


def parity_bit_check(injected_binary_value: str, index: int, parity_bits: int) -> str:
    """Do a binary check for the binary value relating to the given parity bit index
    Args:
        injected_binary_value(str): The binary value to check
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
    # Get length of the binary value
    # Check the required width of the imaginary 2d array
    #   - Width is a power of two, starting with two.
    #   - Height is a power of two, starting with two, but adding AFTER the width

    # TODO: Remove calculations when algorithm works
    # total:p:d 4:3:1, 8:4:4, 16:5:9, 32:6:28
    # 3-1 = 2 => 2**2 = 4
    # 4-1 = 3 => 2**3 = 8
    # 5-1 = 4 => 2**4 = 16
    # 2**(p-1) = total

    # Build a new padded binary value for every parity bit pass
    total = 2**parity_bits
    padded_binary_value = injected_binary_value + "0" * (
        total - len(injected_binary_value)
    )

    # TODO: Get the relevant part of the binary value to check
    if index == 1:
        # Check every even column
        relevant_part = [int(bit) for bit in padded_binary_value[1::2]]
    elif index == 2:
        # Check every 3-4th column
        relevant_part = []
        for i in range(1, index + 1):
            relevant_part += [int(bit) for bit in padded_binary_value[index + i :: 4]]
    elif index == 3:
        # Check every even row
        relevant_part = []
        for row in range(1, math.log2(total) + 1):
            relevant_part += [
                int(bit)
                for bit in padded_binary_value[
                    row * math.log2(total) : row * math.log2(total) * 2 : 2
                ]
            ]
        relevant_part = [int(bit) for bit in padded_binary_value[1::2]]
    # TODO: Need to compensate for odd math.log2(total)...
    # [bit for bit in 'abcdefghijklmnopqrstuvwxyz'[3::4]] + [bit for bit in 'abcdefghijklmnopqrstuvwxyz'[4::4]]
    print(f"log check_value: {math.log2(13)}")

    # Get the number of 1's in the binary value
    ones = sum(relevant_part)
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
    injected_binary_value = inject_parity_bits(binary_value, parity_bits)
    # Check the parity bits and flip if needed
    for i in range(1, parity_bits + 1):
        checked_binary_value = parity_bit_check(injected_binary_value, i, parity_bits)
    # Check the overall parity bit check
    checked_binary_value = parity_bit_check(injected_binary_value, 0, parity_bits)
    return checked_binary_value


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
