/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */

function waitOneSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
}

function waitTwoSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(2);
    }, 2000);
  });
}

function waitThreeSecond() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 3000);
  });
}

function calculateTime() {
  const start = Date.now();

  Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()]).then(
    (values) => {
      console.log(`It took ${Date.now() - start} milliseconds`);
    }
  );
}

calculateTime();