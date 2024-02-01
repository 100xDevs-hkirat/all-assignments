/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
    if (str.length - 1 < 0) return true;
    let start = 0;
    let end = str.length - 1;
    let isPal = true;
    while (start < end) {
        if (
            str[start] === "!" ||
            str[start] === "," ||
            str[start] === " " ||
            str[start] === "." ||
            str[start] === "?"
        ) {
            start += 1;
            continue;
        } else if (
            str[end] === "!" ||
            str[end] === "," ||
            str[end] === " " ||
            str[end] === "." ||
            str[end] === "?"
        ) {
            end -= 1;
            continue;
        }
        if (str[start].toLowerCase() === str[end].toLowerCase()) {
            start += 1;
            end -= 1;
        } else {
            isPal = false;
            break;
        }
    }
    return isPal;
}

module.exports = isPalindrome;
