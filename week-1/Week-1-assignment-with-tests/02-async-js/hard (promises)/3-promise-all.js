/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
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
  console.log(startTime);
  const promises = [waitOneSecond(), waitTwoSecond(), waitThreeSecond()];
  Promise.all(promises).then((result) => {
    console.log(result);
    const endTime = Date.now();
    console.log((endTime - startTime) / 1000);
  });
}

calculateTime();
