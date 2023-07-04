/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
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

function calculateTime() {
  let start = Date.now();
  p1 = waitOneSecond();
  let diff = (Date.now() - start) / 1000.0;
  console.log(`waitOneSecond took ${diff} seconds`);

  start = Date.now();
  p2 = waitTwoSecond();
  diff = (Date.now() - start) / 1000.0;
  console.log(`waitTwoSecond took ${diff} seconds`);

  start = Date.now();
  p3 = waitThreeSecond();
  diff = (Date.now() - start) / 1000.0;

  Promise.all([p1, p2, p3]).then((values) => {
    console.log(values);
  });
}

calculateTime();
