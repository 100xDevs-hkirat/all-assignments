/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/

function calculateTime(n) {
    var initialSum = 0;
    ///will get start time
    const startTime = new Date().getTime();
    ///lets go through all the elements
    for (var initial = 0; initial < n; initial++) {
        initialSum = initialSum + initial;
    }
    ///here will get end time
    const endTime = new Date().getTime();
    console.log(initialSum);
    return endTime - startTime;

}   