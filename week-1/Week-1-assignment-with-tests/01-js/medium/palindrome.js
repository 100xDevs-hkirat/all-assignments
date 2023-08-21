/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {

  var str = str.toLowerCase().trim();
  var s = "";
  for(var i=0; i<str.length; i++){

    if(str[i] >= "a" && str[i] <= "z" && str[i] != " ")
      s = s + str[i];
  }

  for(var i=0; i<s.length/2; i++){
    if(s.charAt(i) != s.charAt(s.length - 1- i))
      return false;
  }

  return true;
}

console.log(isPalindrome("hello"));
// rac ecar

module.exports = isPalindrome;
