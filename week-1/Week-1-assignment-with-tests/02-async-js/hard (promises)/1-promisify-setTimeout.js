/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
  return new Promise((res) => {
    setTimeout(res, n * 1000);
  });
}

const start = new Date();
wait(2).then(() => console.log((new Date() - start) / 1000));
