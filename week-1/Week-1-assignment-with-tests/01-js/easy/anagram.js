/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

// function to sort string 
function sortString(str){
  // first convert string to array 
  strArry = str.split("");
  // now sort the array
  strArry = strArry.sort();
  // again join array to get string
  strNew = strArry.join("");

  return strNew;
}

function isAnagram(str1, str2) {

  if(sortString(str1) != sortString(str2))
     return false;
  
  return true;
  
}


console.log(isAnagram('ak','ka'));


module.exports = isAnagram;
