/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep (seconds) {
    let start= new Date().getTime();
    while(new Date().getTime()-start<seconds*1000);
}
sleep(5);