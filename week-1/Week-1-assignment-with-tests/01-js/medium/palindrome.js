/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  str=str.replace(/ /g,'');
  var punctuation = /[\.,?!]/g;
  str=str.replace(punctuation,"");
  var str2=str.toLowerCase();
  for(var i=0;i<str2.length/2;i++){
     if(str2[str2.length-1-i]!=str2[i]){
      return false;
    }
  }
  return true;
}

module.exports = isPalindrome;

