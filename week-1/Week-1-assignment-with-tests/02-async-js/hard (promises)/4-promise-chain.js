/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Promise resolved after 1 second");
        }, 1000);
    });
}

function waitTwoSeconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Promise resolved after 2 seconds");
        }, 2000);
    });
}

function waitThreeSeconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Promise resolved after 3 seconds");
        }, 3000);
    });
}

function sequentialExecution() {
    const startTime = new Date();

    return waitOneSecond()
        .then(result => {
            console.log(result);
            return waitTwoSeconds();
        })
        .then(result => {
            console.log(result);
            return waitThreeSeconds();
        })
        .then(result => {
            console.log(result);
            const endTime = new Date();
            const totalTime = endTime - startTime;
            console.log("Sequential execution completed in", totalTime / 1000, "seconds");
        });
}

sequentialExecution();