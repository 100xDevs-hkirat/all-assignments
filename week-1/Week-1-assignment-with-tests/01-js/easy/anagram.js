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
  let upper1 = str1.toUpperCase();
  let upper2 = str2.toUpperCase();

  let split1 = upper1.split("");
  let split2 = upper2.split("");

  split1.sort();
  split2.sort();

  if (split1.join() == split2.join()) {
    return true;
  } else {
    return false;
  }
}

module.exports = isAnagram;
