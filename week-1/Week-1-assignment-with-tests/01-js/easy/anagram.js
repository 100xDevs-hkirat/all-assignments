/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/
function isAnagram(str1, str2) {
  str1=str1.toLowerCase();
  str2=str2.toLowerCase();
  if(str1.length!=str2.length){
    return false;
  }

  let ob={};
  for(let i=0;i<str1.length;i++){
    let c=str1.charAt(i);
    if(c in ob){
      ob[c]++;
    }else {
      ob[c]=1;
    }
    
  }

  for(let i=0;i<str2.length;i++){
    let c=str2.charAt(i);
    if(c in ob){

      ob[c]--;
      if(ob[c]===0){
        delete ob[c];
      }
    
    }else{
      return  false;
    }
  }
  return Object.keys(ob).length==0;

  

}





module.exports = isAnagram;