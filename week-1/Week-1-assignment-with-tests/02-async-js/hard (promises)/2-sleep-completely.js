/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep (seconds) {

}

function sleep(seconds) {
  const milliseconds = 1000 * seconds;
  const start = new Date().getTime();
  while (new Date().getTime() - start < milliseconds) {
    // Busy wait for the specified time
  }
}
