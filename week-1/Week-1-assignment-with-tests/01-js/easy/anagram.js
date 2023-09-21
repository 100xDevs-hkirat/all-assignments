/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function changeToMap(str) {
  let map = {};
  for (let i = 0; i < str.length; i++) {
    if (str[i] in map) {
      map[str[i]] = map[str[i]] + 1;
    } else {
      map[str[i].toLowerCase()] = 1;
    }
  }
  return map;
}
function isAnagram(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  if (str1.length != str2.length) {
    return false;
  }
  const str1Map = changeToMap(str1);
  const str2Map = changeToMap(str2);
  for (const key in str1Map) {
    if (str1Map[key] != str2Map[key]) {
      return false;
    }
  }

  return true;
}
module.exports = isAnagram;
