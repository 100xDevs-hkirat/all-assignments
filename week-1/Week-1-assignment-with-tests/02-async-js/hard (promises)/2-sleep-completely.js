/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */
const blockTheThread = (seconds) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res(true);
    }, seconds * 1000);
  });
async function sleep(seconds) {
  console.log("Start");
  await blockTheThread(seconds);
  console.log("end ");
}
sleep(2);
