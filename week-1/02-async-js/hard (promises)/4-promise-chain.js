/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */


function waitOneSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("1sec success");
        },1000);
    })
}

function waitTwoSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("2sec success");
        },2000);
    })
}

function waitThreeSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("3sec success");
        },3000);
    })
}

let start=new Date().getTime();
function calculateTime() {
    waitOneSecond()
        .then((data) => {
            console.log(data);
            return waitTwoSecond();
        })
        .then((data) => {
            console.log(data);
            return waitThreeSecond();
        })
        .then((data) => {
            console.log(data);
            console.log((new Date().getTime()-start)/1000," seconds elasped.");
        })
        .catch((err) =>{
            console.error(err);
        })
}
calculateTime();