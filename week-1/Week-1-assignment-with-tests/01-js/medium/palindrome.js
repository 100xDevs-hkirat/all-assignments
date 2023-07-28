/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
function reverce(str) {
  let strLen = str.length;
  let revStr = "";
  for (var i = strLen - 1; i >= 0; i--) {
    revStr += str[i];
  }
  return revStr;
}

function fransformStr(str) {
  var transformedString = str.replace(/[^A-Za-z]/g, "");
  return transformedString;
}

function isPalindrome(str) {
  var upperStr = str.toUpperCase();
  var finalStr = fransformStr(upperStr);
  let reverceString = reverce(finalStr);
  if (reverceString === finalStr) {
    return true;
  } else {
    return false;
  }
}

module.exports = isPalindrome;
