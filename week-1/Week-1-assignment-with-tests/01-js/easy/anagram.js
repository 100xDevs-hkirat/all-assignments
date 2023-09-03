/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function toRearrange(str){
  var array= str.split('');
  array=array.sort();
  var newStr= array.join('');
  return newStr;
}

function isAnagram(str1,str2){
  str1=str1.toLowerCase();
  str2=str2.toLowerCase();
  if(toRearrange(str1)== toRearrange(str2))
    return true;
  else
    return false
}

module.exports = isAnagram;
