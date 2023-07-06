/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  str=str.toLowerCase();
  const n=str.length;
  for(let i=0,j=n-1;i<j;)
  {
    if(str[i]===' '||str.charCodeAt(i)<97||str.charCodeAt(i)>122)
      i++;
    else if(str[j]===' '||str.charCodeAt(j)<97||str.charCodeAt(j)>122)
      j--;
    else if(str[i]===str[j])
    {
      i++;
      j--;
    }
    else
      return false;
  }
  return true;
}

module.exports = isPalindrome;
