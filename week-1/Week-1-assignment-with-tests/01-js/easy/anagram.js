/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

// function isAnagram(str1, str2){
//   const str1Let = {};
//   const str2Let = {};

//   if (str1.length !== str2.length) {
//     return false;
//   } else {
//     for (let i = 0; i < str1.length; i++) {
//       const letter = str1[i].toLowerCase();
//       if (str1Let[letter]) {
//         str1Let[letter]++;
//       } else {
//         str1Let[letter] = 1;
//       }
//     }
//     for (let i = 0; i < str2.length; i++) {
//       const letter = str2[i].toLowerCase();
//       if (str2Let[letter]) {
//         str2Let[letter]++;
//       } else {
//         str2Let[letter] = 1;
//       }
//     }

//     // Compare the letter count objects
//     for (const letter in str1Let) {
//       if (str1Let[letter] != str2Let[letter]) {
//         return false;
//       }
//     }

//     return true;
//   }
// }
function sort(str1){
  var array = str1.split("")
  array = array.sort();
  var SortArr = array.join(" ")
  return SortArr 
}

function isAnagram(str1,str2){
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()

  if(sort(str1) == sort(str2)){
    return true
  }
  return false
}
module.exports = isAnagram;
