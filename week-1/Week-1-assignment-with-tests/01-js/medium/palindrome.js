/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  var cleanedStr = str.trim().replace(/[^A-Za-z0-9]/g,'').toLowerCase();
  var revCleanedStr = Array.from(cleanedStr).reverse().join('')
  return revCleanedStr===cleanedStr;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"))
module.exports = isPalindrome;
