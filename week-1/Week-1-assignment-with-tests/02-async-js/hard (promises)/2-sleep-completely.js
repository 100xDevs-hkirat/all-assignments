/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

console.log("thread of exxecution going to sleep");
function sleep(seconds) {
  const start = Date.now();
  while (Date.now() - start < seconds * 1000) {
    // console.log("working");
  }
}

sleep(6);

console.log(
  "thread of executionis blocked and this line should not be printed before write operation"
);
