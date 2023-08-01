/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function busyWait(milliseconds) {
    const startTime = Date.now();
    while (Date.now() - startTime < milliseconds) {
      // Do nothing, just loop and wait
    }
  }
  
  // Example usage: Busy wait for 2 seconds
  console.log('Start');
  busyWait(2000);
  console.log('After 2 seconds');

  