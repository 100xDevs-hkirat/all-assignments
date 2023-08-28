/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/
function transform(str ){
  arr = str.split('');
  var str2 ='';
  for( i of arr){
    if (i===',' || i ==='!'|| i ==='?'|| i ===''|| i ==='.'){

    }
    else{
str2+=i;
    }
  }
  return str2 ;
}
function isPalindrome(str) {
 
  // var str1 = str.toLowerCase().split(' ').join('')
  var str1 = transform(str).toLowerCase().split(' ').join('')
  var arr = str1.split('')
  var ans ='';
  var count = 0;
  for (let i =arr.length-1 ; i>=0 ; i--){
    
    
      ans += arr[i];
    
    // console.log(!/^[a-zA-Z0-9]$/.test(arr[i]))
  }
 
  console.log(str1)
  console.log(ans)
 return str1==ans;
}

console.log(isPalindrome('Mr. Owl ate my metal worm.'))
module.exports = isPalindrome;
