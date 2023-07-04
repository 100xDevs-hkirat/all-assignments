/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

// const mySort = (str) => {
//   return str.toLowerCase().replace(/\s/g, '').split('').sort().join('');
// };
const mySort = (str) => {
  return str.toLowerCase().split('').sort().join('')
}

function isAnagram(str1, str2) {
  const sortedStr1 = mySort(str1)
  const sortedStr2 = mySort(str2)

  console.log(sortedStr1, sortedStr2)

  return sortedStr1 === sortedStr2
}

console.log(isAnagram('DebitCard', 'BadCredit'))

module.exports = isAnagram
