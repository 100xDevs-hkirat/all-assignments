/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
  return new Promise((res) => {
    setTimeout(() => {
      res("promise resolved");
    }, 1 * 1000);
  });
}

function waitTwoSecond() {
  return new Promise((res) => {
    setTimeout(() => {
      res("promise resolved");
    }, 2 * 1000);
  });
}

function waitThreeSecond() {
  return new Promise((res) => {
    setTimeout(() => {
      res("promise resolved");
    }, 3 * 1000);
  });
}
startTime = performance.now();
function calculateTime() {
  waitOneSecond()
    .then((result) => {
      console.log("result: ", result);
      return waitTwoSecond();
    })
    .then((result) => {
      console.log("result: ", result);
      return waitThreeSecond();
    })
    .then((result) => {
      console.log("result: ", result);
      endTime = performance.now();
      console.log(endTime - startTime);
    })
    .catch((error) => {
      console.error(error.message);
    });
}
calculateTime();
