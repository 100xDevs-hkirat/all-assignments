/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    while (Date.now() < start + seconds * 1000) {
      // do nothing eat seconds 🙂
    }
    resolve();
  });
}

sleep(5).then(() => {
  console.log("5 seconds have passed!");
});
