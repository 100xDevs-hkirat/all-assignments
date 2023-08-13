/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
    const str1 = str.toLowerCase();
    const str2 = str1.split('').reverse().join('');
  
    return str2 == str1;
  }


module.exports = isPalindrome;
