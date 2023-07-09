/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
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

async function calculateTime() {
  const startTime = Date.now();
  const [data1, data2, data3] = await Promise.all([
    waitOneSecond(),
    waitTwoSecond(),
    waitThreeSecond(),
  ]);
  //   Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()]).then(
  //     (res) => console.log(res)
  //   );
  console.log(Date.now() - startTime, data1, data2, data3);
}

calculateTime();
