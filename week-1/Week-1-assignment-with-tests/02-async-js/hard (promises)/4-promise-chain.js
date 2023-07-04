/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Print out the time it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function waitOneSecond() {
  return new Promise((resolve) => setTimeout(resolve, 1000, 1));
}

function waitTwoSecond() {
  return new Promise((resolve) => setTimeout(resolve, 2000, 2));
}

function waitThreeSecond() {
  return new Promise((resolve) => setTimeout(resolve, 3000, 3));
}

async function calculateTime() {
  const start = Date.now();
  const val = await waitOneSecond()
    .then((v) => waitTwoSecond())
    .then((v) => waitThreeSecond());
  const diff = (Date.now() - start) / 1000.0;
  console.log(`Total took ${diff} seconds`);

  console.log(val);
}

calculateTime();
