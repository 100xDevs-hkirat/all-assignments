/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateSum(n) {
    let sum = 0;
    let i = 1;
    while(i <= n) {
      sum += i;
      i++;
    }
    return sum;
  }

function calculateTime(n) {
    const start = performance.now();
    calculateSum(n);    
    const end = performance.now();
    const time = (end-start)/1000;
    return time;
}

const result = calculateTime(1000000000);
console.log(result);