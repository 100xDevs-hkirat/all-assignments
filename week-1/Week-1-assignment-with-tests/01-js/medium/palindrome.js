/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(s) {
  s = s.toLowerCase().trim();
  s = s.replace(/[\.,?! ]/g, "");
  const slen = s.length;
  for (let i = 0; i < parseInt(slen / 2); i++) {
    if (s[i] !== s[slen - i - 1]) {
      return false;
    }
  }
  return true;
}

module.exports = isPalindrome;
