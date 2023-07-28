/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateTime(n) {
    const startTime = performance.now();
    var sum = 0;
    for(var i =1;i<=n;i++){
        sum = sum + i;
    }
    console.log('Sum is: '+sum);
    const endTime = performance.now();
    console.log('Time taken: ' + (endTime - startTime)/1000);
}
var n =4;
calculateTime(n);

