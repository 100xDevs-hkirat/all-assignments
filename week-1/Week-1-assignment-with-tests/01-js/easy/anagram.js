/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function compareObjects(str1Freq, str2Freq) {
  const keys1 = Object.keys(str1Freq);
  const keys2 = Object.keys(str2Freq);

  if (keys1.length !== keys2.length) {
    // console.log("false");
    return false;
  }

  for (let key of keys1) {
    if (!str2Freq.hasOwnProperty(key) || str1Freq[key] !== str2Freq[key]) {
      // console.log("false");
      return false;
    }
  }

  // console.log("true");
  return true;
}

function isAnagram(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  str2.toLowerCase();
  let str1Freq = {};
  let str2Freq = {};

  str1.split("").forEach((element) => {
    let val = str1Freq[`${element}`];
    let valToUpadte = (!val ? 0 : val) + 1;
    str1Freq[`${element}`] = valToUpadte;
    return false;
  });

  str2.split("").forEach((element) => {
    let val = str2Freq[`${element}`];
    let valToUpadte = (!val ? 0 : val) + 1;
    str2Freq[`${element}`] = valToUpadte;
  });

  return compareObjects(str1Freq, str2Freq);
}

// function isAnagram2(str1, str2) {
//   if (str1.length === str2.length) {
//     let str2Arr = str2.split("");
//     for (let i = 0; i < str1.length; i++) {
//       if (!str2Arr.includes(str1[i])) return false;
//       else str2Arr.splice(str2Arr.indexOf(str1[i]), 1);
//     }
//     return true;
//   } else {
//     return false;
//   }
// }

// var isAnagram3 = function (str1, str2) {
//   const str3 = str1.split("").sort().toString();
//   const str4 = str2.split("").sort().toString();
//   return str3 === str4;
// };

module.exports = isAnagram;
