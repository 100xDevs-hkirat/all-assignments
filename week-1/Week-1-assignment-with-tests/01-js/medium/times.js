/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateTime(n) {

    var sum = 0;
    var t1 = new Date().getTime();

    for(var i=0; i<=n; i++)
        sum += i;

    var t2 = new Date().getTime();  
    var seconds = (t2 - t1);

    return (seconds);
}

console.log(calculateTime(1000000000));