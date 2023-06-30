/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */

function waitOneSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("After 1 Sec");
            resolve("After 1 Sec");
        }, 1000)
    })
}

function waitTwoSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("After 2 Sec");
            resolve("After 2 Sec");
        }, 2000)
    })
}

function waitThreeSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("After 3 Sec");
            resolve("After 3 Sec");
        }, 3000)
    })
}

function calculateTime() {
    Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()]).then(function (values) {
        console.log(values);
    })
}

calculateTime();