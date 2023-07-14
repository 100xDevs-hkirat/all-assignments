/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  const start = Date.now();
  while (Date.now() - start < seconds * 1000) {
    // Do nothing, just keep looping until the desired time has elapsed
  }
}

async function logTimer() {
  console.log(`Start: ${new Date()}`);
  sleep(3);
  console.log(`End: ${new Date()}`);
}

logTimer();
