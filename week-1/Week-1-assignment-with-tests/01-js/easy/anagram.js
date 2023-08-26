/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  var res1 = str1.toLowerCase().split("").sort().join();
  var res2 = str2.toLowerCase().split("").sort().join();
  return res1 === res2;
}

module.exports = isAnagram;
