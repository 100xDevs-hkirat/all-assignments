/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculate(n){
  var time1=new Date;
  var before=time1.getMilliseconds();
  var sum=0;
  for(var i=0;i<n;i++){
    sum=sum+i;
  }
  var time2=new Date;
  var after=time2.getMilliseconds();
  return after-before;
}
//better to use performance.now() function 
console.log(calculate(1000000));
}
