/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  // removing all the specials characters , punctuations and white spaced
  str = str.toLowerCase().replace(/[!"#$%&'()*+,-./:;<=>?@[\_\s]/g, "");

  let i = 0; // first element
  let j = str.length - 1; // last element

  while (i < j) {
    if (str[i] === str[j]) {
      i++;
      j--;
    } else {
      return false;
    }
  }

  return true;
}

module.exports = isPalindrome;
