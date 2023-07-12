/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  if(str1.length !== str2.length){
   return "String are not anagram";
  }

  let asc1=0, asc2=0;
  
  for( let i of str1){
    asc1 = asc1+ i.charCodeAt(0);
  }
  for( let i of str2){
    asc2 = asc2+ i.charCodeAt(0);
  }

  if(asc2 === asc1){
    return "String are anagram";
  }

 return "String are not anagram";
}
console.log(isAnagram("lion","nkol"));

module.exports = isAnagram;
