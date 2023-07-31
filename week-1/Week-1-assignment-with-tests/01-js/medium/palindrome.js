const isAnagram = require("../easy/anagram");

/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
function ReverseString(str) {
  return str.split("").reverse().join("");
}
function removeSpacesAndPunctuation(text) {
  return text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
}

function isPalindrome(str) {
  // let str2 = convertToLowerCase(str);
  str = removeSpacesAndPunctuation(str);
  str = str.toLowerCase();

  let str2 = ReverseString(str);
  if (str == str2) return true;
  else return false;
}
// str = "Eva, can I see bees in a cave?";
// // var str = str.toLowerCase();
// console.log( isPalindrome(str) );
module.exports = isPalindrome;
