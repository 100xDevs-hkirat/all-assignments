/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  console.log("Thread is going to wait now....");
  return new Promise((resolve, reject) => {
    const st = Date.now();
    var a = 1;
    while (Date.now() - st < seconds * 1000) {}
    resolve(seconds);
  });
}

sleep(5).then((message) => {
  console.log("Thread resumed after " + message + " seconds");
});
