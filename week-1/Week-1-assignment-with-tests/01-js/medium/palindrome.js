/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
const reverseString = (str) => str.split("").reverse().join("");

const joinSpaces = (str) => str.split(" ").join("");

const removePuncuations = (str) =>
  str
    .replaceAll("?", "")
    .replaceAll("!", "")
    .replaceAll(",", "")
    .replaceAll(".", "");

function isPalindrome(str) {
  const plainStr = removePuncuations(str.toUpperCase());
  const oneStr = joinSpaces(plainStr);
  const revStr = reverseString(oneStr);

  return oneStr === revStr;
}

module.exports = isPalindrome;
