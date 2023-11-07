/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
function isaValidLetter(str) {
  return str.length === 1 && str.match(/[a-z]/);
}

function isPalindrome(str) {
  str = str.toLowerCase();
  var len = str.length;
  var i = 0,
    j = len - 1;
  while (i < j) {
    if (!isaValidLetter(str[i])) {
      i++;
    } else if (!isaValidLetter(str[j])) {
      j--;
    } else if (str[i] === str[j]) {
      i++;
      j--;
    } else return false;
  }
  return true;
}

module.exports = isPalindrome;
