/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
const basic = (str) => String(str).toLowerCase().replace(/[^\w]/g, '')
function isPalindrome(str) {
  const str1 = basic(str);
  const str2 = basic(str).split('').reverse().join('')
  console.log(str1,str2)
  return str1 ===str2;
}

module.exports = isPalindrome;
