/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function reverse(str){
  var revstr="";
  for(var i= str.length-1;i>=0;i--){
    revstr+=str[i];
  }
  return revstr;
}

function correction (str){
  var cstr="";
  for(var i=0;i<str.length;i++){
    if(str.charCodeAt(i)>=33 && str.charCodeAt(i)<=64 || str.charCodeAt(i)>=91 && str.charCodeAt(i)<=96 || str.charCodeAt(i)>=123 && str.charCodeAt(i)<=126 || str[i]==' '){}
    else 
      cstr+=str[i];
  }
  return cstr;
}

function isPalindrome(str) {
  var cstr= correction(str);
  cstr=cstr.toLowerCase();
  var reversedString= reverse(cstr);
  if (cstr==reversedString)
    return true;
  else 
    return false;
}

module.exports = isPalindrome;
