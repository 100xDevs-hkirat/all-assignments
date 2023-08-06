/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */
function waitOneSecond() {
    let p1 = new Promise(function(resolve,reject){
        setTimeout(() => {
            console.log("Promise resolved after 1 second") 
            resolve(1)
        }, 1*1000);
    })
    return p1;
}

function waitTwoSecond() {
    let p2 = new Promise(function(resolve,reject){
        setTimeout(() => {
            console.log("Promise resolved after 2 seconds") 
            resolve(2)
        }, 2*1000);
    })
    return p2;
}

function waitThreeSecond() {
    let p3 = new Promise(function(resolve,reject){
        setTimeout(() => {
            console.log("Promise resolved after 3 seconds") 
            resolve(3)
        }, 3*1000);
    })
    return p3;
}

function calculateTime() {
    let start = Date.now(); 
    waitOneSecond().then((value)=>{
        console.log(value)
        return waitTwoSecond(); // return the next promise
    }).then((value)=>{ // chain the next .then handler
        console.log(value)
        return waitThreeSecond(); // return the next promise
    }).then((value)=>{ // chain the final .then handler
        console.log(value)
        let end = Date.now()
        console.log(`${end-start}`)
    }).catch((err)=>{
        console.log(err)
    })
}

calculateTime();
//Promise.all perform task parallel and promise chain perform task individually