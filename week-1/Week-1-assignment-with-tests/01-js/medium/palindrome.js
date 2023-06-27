/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isAlphabet(char) {
  return /[a-zA-Z]/.test(char);
}

function isPalindrome(str) {
  str = str.toLowerCase();
  let i = 0;
  let j = str.length - 1;
  while (i < j) {
    if (!isAlphabet(str.charAt(i))) {
      i++;
    } else if (!isAlphabet(str.charAt(j))) {
      j--;
    } else {
      if (str.charAt(i) !== str.charAt(j)) {
        return false;
      }
      i++;
      j--;
    }
  }
  return true;
}

module.exports = isPalindrome;
