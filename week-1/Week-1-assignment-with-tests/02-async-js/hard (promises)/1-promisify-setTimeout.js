/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${n} Hellow World!`);
    }, n * 1000);
  });
}

wait(3).then((data) => console.log(data)); // 1st way

async function waitUsingAwait(n) {
  const data = await wait(n); //2nd way
  console.log(data);
}

waitUsingAwait(1);
