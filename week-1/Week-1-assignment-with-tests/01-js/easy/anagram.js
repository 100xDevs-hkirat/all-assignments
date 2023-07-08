/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  let map = new Map();
  for (const ch of str1) {
    map.set(ch, (map.get(ch) | 0) + 1);
  }

  for (const ch of str2) {
    let value = map.get(ch);
    if (value !== undefined && value > 0) {
      map.set(ch, value--);
    } else {
      return false;
    }
  }
  return true;
}

module.exports = isAnagram;
