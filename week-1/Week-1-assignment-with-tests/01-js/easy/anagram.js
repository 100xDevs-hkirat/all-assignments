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
    let temp1 = str1.split(" ").join("").toLowerCase().split("").sort().join("");
    let temp2 = str2.split(" ").join("").toLowerCase().split("").sort().join("");
    console.log(temp1)
    console.log(temp2)
    return temp1 === temp2;
}

isAnagram('Debit Card', 'Bad Credit')
module.export = isAnagram
