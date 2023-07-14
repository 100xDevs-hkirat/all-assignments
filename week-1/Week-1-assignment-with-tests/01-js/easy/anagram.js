/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

const sortString = (str) => str.toUpperCase().split("").sort().join("");

function isAnagram(str1, str2) {
  return sortString(str1) === sortString(str2);
}

module.exports = isAnagram;
