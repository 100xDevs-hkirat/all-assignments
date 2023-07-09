/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  var s = "";
  for (i = 0; i < str.length; i++) {
    if (str[i] != " " && checkIsAlphaOrNum(str[i])) {
      s = s + str[i].toLowerCase();
    }
  }
  if (s == "") s = str;
  s1 = s;
  s = s.split("");
  console.log(s);
  s = s.reverse();
  console.log(s);
  s = s.join("");
  console.log(s);
  if (s1 == s) return true;
  else return false;
}
function checkIsAlphaOrNum(letter) {
  letter = letter.toLowerCase();
  if (letter >= "a" && letter <= "z") {
    return true;
  }
  return false;
}

module.exports = isPalindrome;
