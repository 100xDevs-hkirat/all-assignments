/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('waitOneSecond');
      resolve(1000);
    }, 1000)
  );
}

function waitTwoSecond() {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('waitTwoSecond');
      resolve(2000);
    }, 2000)
  );
}

function waitThreeSecond() {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('waitThreeSecond');
      resolve(3000);
    }, 3000)
  );
}

function calculateTime() {
  const startTime = Date.now();
  waitOneSecond()
    .then((time1) => {
      console.log('waitOneSecond resolved');
      return waitTwoSecond();
    })
    .then((time2) => {
      console.log('waitTwoSecond resolved');
      return waitThreeSecond();
    })
    .then((time3) => {
      console.log('waitThreeSecond resolved');
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      console.log('Total time:', totalTime, 'ms');
    });
}

calculateTime();
