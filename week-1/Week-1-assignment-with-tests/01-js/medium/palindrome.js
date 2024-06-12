/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  str = str.toLowerCase();
  var arr = str.split("");
  if( arr.indexOf(' ') != -1) return true;
  arr = arr.reverse();
  var str2 = arr.join("");
  if(str == str2) return true;
  else return false;
}

module.exports = isPalindrome;
