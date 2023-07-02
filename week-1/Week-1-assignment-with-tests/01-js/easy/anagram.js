/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/
function sort(st){
  var arr = st.split("");
  arr = arr.sort();
  var sortedStre = arr.join("");
  return sortedStre;

}

function isAnagram(str1, str2) {
  //This is a comment
  if(sort(str1.toUpperCase()) === sort(str2.toUpperCase())){
    return true;
  }
  else{
    return false;
  }
}

module.exports = isAnagram;
