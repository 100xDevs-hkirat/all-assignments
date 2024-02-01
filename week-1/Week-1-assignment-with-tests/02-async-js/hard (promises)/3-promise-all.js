/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */

function waitOneSecond() {
  return new Promise((resolve) => setTimeout(() => resolve("Part One"), 1000));
}

function waitTwoSecond() {
  return new Promise((resolve) => setTimeout(() => resolve("Part Two"), 2000));
}

function waitThreeSecond() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("Part Three"), 3000)
  );
}

async function calculateTime() {
  const startSeconds = new Date().getSeconds();
  const promisesResult = await Promise.all([
    waitOneSecond(),
    waitTwoSecond(),
    waitThreeSecond(),
  ]);

  const endSeconds = new Date().getSeconds();
  console.log(promisesResult);
  console.log(
    `Time took to complete the whole operation is ${endSeconds - startSeconds}`
  );
}

calculateTime();
