/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateTime(n) {
    var startTime = new Date();
    var ans = 0;
    for (let i = 1; i <= n ; i++) {
        ans+=i;
         
    }
    var endTime = new Date();
    var elapsedTime = (endTime-startTime)/1000;
    console.log(ans);
    console.log(elapsedTime.toPrecision(5));
}
calculateTime(100);
calculateTime(100000);
calculateTime(1000000000);