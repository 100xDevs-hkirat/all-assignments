/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  let str1="";
  for(let i=0;i<str.length;i++){
    let ascii=str[i].charCodeAt(0);
    if((ascii>=65 && ascii<=91) || (ascii>=97 && ascii<=122)) str1+=str[i];
  }
  //Reversing the string obtained from above process
  let str2="";
  for(let i=str1.length-1;i>=0;i--){
    str2+=str1[i]
  }
  str1=str1.toLowerCase()
  str2=str2.toLowerCase();
  return str1===str2
}

module.exports = isPalindrome;
