/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
  var tempStr1= str1.toLowerCase();
  var tempStr2 = str2.toLowerCase();
  if(tempStr1.length!==tempStr2.length){
      return false;
    }
    var siu=false;
    var pop=Array(26).fill(0);
  
   var mop=Array(26).fill(0);
    
    for(var i=0 ; i < tempStr1.length ; i++){
      
      pop[tempStr1.charCodeAt(i)-97]++;
    }
    for(var i=0 ; i < tempStr2.length ; i++){
      mop[tempStr2.charCodeAt(i)-97]++;
    }
    for(var i = 0 ; i < 26 ; i++){
      if(pop[i]!=mop[i])
        return false;
        
    }
    return true;

}

module.exports = isAnagram;
