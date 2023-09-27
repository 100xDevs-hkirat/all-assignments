/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {

  let i=0, j=str.length-1;
  while(i < j){
    if(str[i] === " " || str[i] === "?" || str[i] === "!" || str[i] === "," || str[j] === "."){
      i = i+1;
      continue;
    }
    if(str[j] === " " || str[j] === "?" || str[j] === "!" || str[j] === "," || str[j] === "."){
      j = j-1;
      continue;
    }
    if(str[i].toLowerCase() === str[j].toLowerCase()){
      i = i+1;
      j = j-1;
      continue;
    }
    else{
      return false;
    }
  }

  return true;
}

module.exports = isPalindrome;
