/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function main() {
  seconds = 5;
  await sleep(seconds);
  console.log(`here after ${seconds} seconds!`);
}

main();
