/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(s, t) {
  s = s.toLowerCase();
  t = t.toLowerCase();
  if (s.length !== t.length) {
    return false;
  }
  let myarr = new Array(128).fill(0);
  for (let i = 0; i < s.length; i++) {
    myarr[s.charCodeAt(i)]++;
    myarr[t.charCodeAt(i)]--;
  }
  for (let i = 0; i < myarr.length; i++) {
    if (myarr[i] !== 0) {
      return false;
    }
  }
  return true;
}

module.exports = isAnagram;
