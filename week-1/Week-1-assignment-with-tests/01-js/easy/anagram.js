/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/
function sort(str){
  var arr = str.split("");
  arr = arr.sort();
  var str2 = arr.join("");
  return str2;
}

function isAnagram(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  var sortedstr1 = sort(str1);
  var sortedstr2 = sort(str2);
  if(sortedstr1 == sortedstr2){
    return true;
  } else{
    return false;
  }
}

module.exports = isAnagram;
