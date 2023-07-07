/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
  console.log(`Creating a Promise.. It will be resolved in ${n} seconds`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Promise is resolved");
    }, n * 1000);
  });
}

wait(2).then((Response) => console.log(Response));
