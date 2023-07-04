/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
  return new Promise((resolve, reject) => {
    if (n <= 10000) {
      setTimeout(() => {
        resolve(`Promise resolved after ${n / 1000} seconds`);
      }, n);
    } else if (n > 10000) {
      reject('Do not pass more than 10000 ms');
    } else {
      reject('Please pass seconds as an argument to the function');
    }
  });
}

wait(-1000)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
