let counter = 0;
let IntervalId;

function stopWatch() {
    counter++
    console.clear();
    console.log(counter);
    IntervalId = setTimeout(stopWatch, 1000)
}

// start the stopWatch fn and It will recursively call itself for infinite 
stopWatch();