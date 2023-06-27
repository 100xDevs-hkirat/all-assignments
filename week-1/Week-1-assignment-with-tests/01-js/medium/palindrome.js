/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str1){
  str1 = str1.toLowerCase().replace(/^a-z0-9/, '')
    for(let i= 0; i< (str1.length)/2; i++){
        if(str1[i] != str1.at((i-1)-2*i))
            return false
    }
    return true
  }
module.exports = isPalindrome



