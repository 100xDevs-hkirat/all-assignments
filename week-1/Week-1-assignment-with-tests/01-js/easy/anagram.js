/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
const news1 = str1.toLowerCase().
            replace(/\s/g , "")
           .split('')
           .sort()
           .join('') ;
const news2= str2.toLowerCase() .replace(/\s/g , "")
           .split('')
           .sort()
           .join('') ;
           
console.log(news1 );
console.log(news2 );
  return news1==news2 ;
}
console.log(isAnagram('openai' , 'open!'));
module.exports = isAnagram;
