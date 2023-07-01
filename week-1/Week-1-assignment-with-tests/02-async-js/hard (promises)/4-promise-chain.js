/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
  return new Promise((res) => setTimeout(res, 1000));
}

function waitTwoSecond() {
  return new Promise((res) => setTimeout(res, 2000));
}

function waitThreeSecond() {
  return new Promise((res) => setTimeout(res, 3000));
}

function calculateTime() {
  const start = new Date();
  waitOneSecond()
    .then(waitTwoSecond)
    .then(waitThreeSecond)
    .then(() => console.log((new Date() - start) / 1000));
}

calculateTime();
