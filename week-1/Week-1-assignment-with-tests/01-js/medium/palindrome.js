/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
    str = str.toLowerCase().replace( /[^\w]/g,'');
    let i=0, j=str.length-1;
    while(i<=j){
        if(str.charAt(i)==str.charAt(j)){
            i++;
            j--;
        } else {
            return false
        }
    }
    return true;
}

module.exports = isPalindrome;
