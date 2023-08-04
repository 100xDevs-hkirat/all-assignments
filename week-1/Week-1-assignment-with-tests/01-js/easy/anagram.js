/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function sorted_String(str_input) {
  let clean_string = str_input.toLowerCase();
  const characters = clean_string.split("");
  characters.sort();
  return characters.join("");
}

function isAnagram(str1, str2) {
  if (sorted_String(str1) == sorted_String(str2)) {
    return true;
  } else {
    return false;
  }
}
module.exports = isAnagram;
