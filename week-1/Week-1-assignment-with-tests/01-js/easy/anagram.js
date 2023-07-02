/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {

  let arr1 = str1.toLowerCase().split("")
  let arr2 = str2.toLowerCase().split("")

  if (str1.length != str2.length){
    return false
  }

  for (let element of arr1){
     
      if (arr2.indexOf(element) == -1){
        return false
      }
  }
  return true;

}

module.exports = isAnagram;

// console.log(isAnagram("hey","yeh"))