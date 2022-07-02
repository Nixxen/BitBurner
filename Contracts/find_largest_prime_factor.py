# Find Largest Prime Factor
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# A prime factor is a factor that is a prime number. What is the largest prime
# factor of 588155342?

import math


def main(number: int) -> None:
    largest_prime_factor = find_largest_prime_factor(number)
    print(largest_prime_factor)


def find_largest_prime_factor(number: int) -> int:
    """
    Args:
        number (int): Number to find largest prime factor of
    Returns:
        int: Largest prime factor of number
    """
    # Times number goes into 2
    max_prime = 0
    while number % 2 == 0:
        max_prime = 2
        number >>= 1 # Signed right shift, divides by 2

    # Times number goes into 3
    while number % 3 == 0:
        max_prime = 3
        number //= 3 # Floor division

    # Iterate through odd numbers from 5 to sqrt(number) + 1
    # Times number goes into odd number
    sqrt_number = math.sqrt(number)
    for i in range(5, int(sqrt_number) + 1, 6):
        while number % i == 0:
            max_prime = i
            number //= i
        while number % (i + 2) == 0:
            max_prime = i + 2
            number //= i + 2

    # If number is a prime number greater than 4, number is the largest prime factor
    if number > 4:
        max_prime = number

    return max_prime

if __name__ == "__main__":
    NUMBER = 588155342
    main(NUMBER)
