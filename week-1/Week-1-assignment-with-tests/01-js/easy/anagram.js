/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  str1.toLowerCase();
  str2.toLowerCase();
    const str1array = str1.split("");
    const str2array = str2.split("");

    str1array.sort();
    str2array.sort();
    const str1joined = str1array.join("");
    const str2joined = str2array.join("");
    if(str1joined === str2joined){
        return true;
    }
    else{
        return false;
    }
}

module.exports = isAnagram;

isAnagram("ajar","raja")