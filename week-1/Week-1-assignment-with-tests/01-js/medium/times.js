/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateTime(n) {
  const ms1 = Date.now();
  m = 0;
  for (i = 0; i < n; i++) {
    m = m + i;
  }
  const ms2 = Date.now();
  var ans = ms2 - ms1;
  console.log(ans);
  console.log(ans / 1000);
}

calculateTime(1000);
calculateTime(100000);
calculateTime(1000000000);
