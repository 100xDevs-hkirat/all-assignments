/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') return false;
  return (
    str1.toUpperCase().split('').sort().join('') ===
    str2.toUpperCase().split('').sort().join('')
  );
}

module.exports = isAnagram;
