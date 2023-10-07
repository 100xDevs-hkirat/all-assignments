/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

let regex = /[a-z]/g;

// let str1 = 'string';
// let f = str1.split('');

function isPalindrome(str) {
  let lower = str.toLowerCase();
  if(str.length > 2) {
    let string = lower.match(regex);
    return string.join('') === string.reverse().join('')
  }else {
    return true;
  }
}


module.exports = isPalindrome;
