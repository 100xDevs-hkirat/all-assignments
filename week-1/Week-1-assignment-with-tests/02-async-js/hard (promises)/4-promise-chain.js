/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("1 sec");
    }, 1000);
  });
}

function waitTwoSecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("2 sec");
    }, 2000);
  });
}

function waitThreeSecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("3 sec");
    }, 3000);
  });
}

// async function calculateTime() {
//   const startTime = Date.now();
//   await waitOneSecond();
//   await waitTwoSecond();
//   await waitThreeSecond();
//   console.log(Date.now() - startTime);
// }

function calculateTime() {
  const startTime = Date.now();
  waitOneSecond().then((data1) => {
    waitTwoSecond().then((data2) => {
      waitThreeSecond().then((data3) => {
        console.log(Date.now() - startTime);
      });
    });
  });
}

calculateTime();
