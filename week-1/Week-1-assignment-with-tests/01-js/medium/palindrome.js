/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function removeSpace(str){
  var newString = "";
  for (var i = str.length - 1; i >= 0; i--) { 
    if(!(str[i] == " "))
        newString += str[i];
    }
  return newString;
  
}
function isPalindrome(str) {
  str = str.toLowerCase();
  str = str.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"").split("").reverse().join("");
  str = removeSpace(str);
  var rev = str.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"").split("").reverse().join("");
  rev = removeSpace(str);
  if(rev === str)  return true;
  else return false;
}

module.exports = isPalindrome;
