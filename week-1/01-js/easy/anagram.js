/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) 
{
  const n=str1.length;
  str1=str1.toLowerCase();
  str2=str2.toLowerCase();
  if(str2.length!=n)
    return false;
  let arr1=str1.split('').sort();
  let arr2=str2.split('').sort();
  for(let i=0; i<n ;i++)
  {
    if(arr1[i]!=arr2[i])
      return false;
  }
  return true;
}

module.exports = isAnagram;
