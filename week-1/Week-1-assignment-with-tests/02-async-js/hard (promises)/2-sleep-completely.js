/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

let seconds = 5;

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

console.log("JS Thread will be paused for ", seconds, " seconds");

sleep(seconds).then(() =>
  console.log(`JS Thread was busy for ${seconds} seconds`)
);
