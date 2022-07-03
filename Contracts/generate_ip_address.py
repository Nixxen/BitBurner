# Generate IP Addresses
#
# You are attempting to solve a Coding Contract. You have 10 tries remaining,
# after which the contract will self-destruct.
#
# Given the following string containing only digits, return an array with all
# possible valid IP address combinations that can be created from the string:
#
# 3324516100
#
# Note that an octet cannot begin with a '0' unless the number itself is
# actually 0. For example, '192.168.010.1' is not a valid IP.
#
# Examples:
#
# 25525511135 -> [255.255.11.135, 255.255.111.35] 1938718066 -> [193.87.180.66]


def main():
    testing = False
    if testing:
        ip_addresses = [
            "1111",
            "111222133144",
            "111",
            "1112221331441",
            "25505011535",
            "25525511135",
            "1938718066",
            "3324516100",
        ]
        # fmt: off
        answers = [
            ["1.1.1.1"],
            ["111.222.133.144"],
            [],
            [],
            [],
            ["255.255.11.135", "255.255.111.35"],
            ["193.87.180.66"],
            ['33.245.16.100']
        ]
        # fmt: on
        for ip_address, answer in zip(ip_addresses, answers):
            result = generate_ip_addresses(ip_address)
            print(f"Tested string {ip_address}")
            print(f"Expected result: {answer}")
            print(f"Got result: {result}")
            assert result == answer, f"Expected {answer}, got {result}"
            print("")
        print("Test passed")
    else:
        print("Enter an IP address:")
        ip_address = "3324516100"
        result = generate_ip_addresses(ip_address)
        print(result)


def is_valid_octet(octet: str) -> bool:
    """Checks if the given octet is valid as an IP octet
    Args:
        octet (str): String containing only digits
    Returns:
        bool: True if the octet is valid, False otherwise
    """
    if len(octet) > 3:
        return False
    if octet[0] == "0" and len(octet) > 1:
        return False
    if int(octet) > 255:
        return False
    return True


def is_valid_ip(ip_address: str) -> bool:
    """Checks if the given IP address is valid.
    Args:
        ip_address (str): String containing dot separated digits
            e.g. "1.1.1.1", "192.168.1.1", or "127.0.0.1"
    Returns:
        bool: True if the IP address is valid, False otherwise
    """
    octets = ip_address.split(".")
    if len(octets) != 4:
        return False
    for octet in octets:
        if not is_valid_octet(octet):
            return False
    return True


def generate_ip_addresses(ip_address: str) -> list:
    """Generates all possible IP addresses from the given string.
    Args:
        ip_address (str): String containing only digits
    Returns:
        list: List of IP addresses
    """
    # Edge cases. These are not needed, since the O(n^3) algorithm will come to
    # the same conclusion, but there is no point running the algorithm if the
    # solution can be found in < O(n)
    if len(ip_address) < 4 or len(ip_address) > 12:
        return []
    if not ip_address.isdigit():
        return []
    if len(ip_address) == 4:
        output = ""
        for digit in ip_address:
            output += digit + "."
        return [output[:-1]]
    if len(ip_address) == 12:
        output = ""
        for index in range(0, len(ip_address), 3):
            if is_valid_octet(ip_address[index : index + 3]):
                output += ip_address[index : index + 3] + "."
        return [output[:-1]]
    valid_ips = []
    # Generate all IP addresses from the string, then check for validity
    for first in range(1, len(ip_address) - 2):
        for second in range(first + 1, len(ip_address) - 1):
            for third in range(second + 1, len(ip_address)):
                ip_potential = (
                    ip_address[:first]
                    + "."
                    + ip_address[first:second]
                    + "."
                    + ip_address[second:third]
                    + "."
                    + ip_address[third:]
                )
                if is_valid_ip(ip_potential):
                    valid_ips.append(ip_potential)
    return valid_ips


if __name__ == "__main__":
    main()
