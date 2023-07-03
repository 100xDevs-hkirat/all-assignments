/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  let t = Date.now();
  while (parseInt(Date.now() - t) !== seconds) {}
}
console.log("Hello");
sleep(3000);
console.log("World");
