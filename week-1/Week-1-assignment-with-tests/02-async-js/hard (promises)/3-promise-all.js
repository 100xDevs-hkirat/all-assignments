/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */

function waitOneSecond() {
  return new Promise((res, rej) => {

    setTimeout(() => {
        console.log('promise 1 executed');
        res(true);
    }, 1000);
  });
}

function waitTwoSecond() {
    return new Promise((res, rej) => {

        setTimeout(() => {
            console.log('promise 2 executed');
            res(true);
        }, 2000);
      });
}

function waitThreeSecond() {
    return new Promise((res, rej) => {

        setTimeout(() => {
            console.log('promise 3 executed');
            res(true);
        }, 3000);
      });
}

async function calculateTime() {
    const allPromises = [waitOneSecond(),waitTwoSecond(),waitThreeSecond()]
    console.time();
   await Promise.all(allPromises);
    console.timeEnd();

}
calculateTime();