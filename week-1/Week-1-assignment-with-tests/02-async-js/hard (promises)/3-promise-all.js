/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */


function waitOneSecond() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Promise 1 is resolved!!');
        },1000);

    });

}

function waitTwoSecond() {
    return new Promise((resolve)=>{
        setTimeout(() =>{
            resolve('Promise 2 is resolved!!')
        },2000);
    });
}

function waitThreeSecond() {
    return new Promise((resolve) =>{
        setTimeout(()=>{
            resolve('Promise 3 is resolved!!');
        },3000);
    });

}

function waitForAllPromises() {
    const startTime = Date.now();
    
    Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()])
      .then((results) => {
        const endTime = Date.now();
        console.log('All promises resolved:', results);
        console.log('Time taken for all promises to resolve:', endTime - startTime, 'milliseconds');
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
  waitForAllPromises();
  