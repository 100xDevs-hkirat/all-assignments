/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
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
    Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()])
        .then((result) => {
            console.log(result);
            let end = Date.now();
            console.log(`Total time taken ${end-start}`)
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
        
      
        
}

calculateTime();
