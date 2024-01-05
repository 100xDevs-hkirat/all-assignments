/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
  return new Promise((resolve, reject) => {
    if (n < 0) {
      reject("rejected");
    } else {
      setTimeout(() => {
        resolve(` resolved after ${n} seconds`);
      }, n * 1000); 
    }
  });
}
