
  /*
   * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
   * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
   * Print how long it took for all 3 promises to resolve.
   */

  const { log } = require("console");

  function waitOneSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("one second has passed");
        resolve();
      }, 1000);
    });
  }

  function waitTwoSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("two second has passed");
        resolve();
      }, 2000);
    });
  }

  function waitThreeSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("three second has passed");
        resolve();
      }, 3000);
    });
  }

  function calculateTime() {
    const before = new Date().getTime();
    waitOneSecond().then(() => {
      waitTwoSecond().then(() => {
        waitThreeSecond().then(() => {
          const after = new Date().getTime();
          const time = after - before;
          console.log(`Time taken: ${time} ms`);
        });
      });
    });
  }

  calculateTime();

