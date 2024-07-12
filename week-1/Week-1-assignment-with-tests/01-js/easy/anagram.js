/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  ///check if both the strings are of same length
  ///order it and then use == operator

  if (str1.length != str2.length) {
    return false;
  }

  ///There is no direct method to order so,
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();


  ///split the string into array,sort the array then join the array 
  str1 = str1.split('').sort().join('');
  str2 = str2.split('').sort().join('');

  if (str1 == str2) {
    return true;
  } else {
    return false;
  }
}

module.exports = isAnagram;
