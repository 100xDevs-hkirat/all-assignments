/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  let string1 = str1.toLowerCase().split('');
  let string2 = str2.toLowerCase().split('');
  let result = false;

    let i=0;
    while(i<string1.length) {
      if(string1.includes(string2[i])) {
        result = true;
      }
      else {
        result = false;
      }
      i++;
    }
  return result
  // console.log(result);
}

// isAnagram('','');

module.exports = isAnagram;
