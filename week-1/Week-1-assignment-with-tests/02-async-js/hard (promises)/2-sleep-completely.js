/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep (seconds) {
    let start = Date.now();
    let end = Date.now() - start;
    let sec = 0;
    while( end/1000 <= seconds ){
        if(Math.floor(end/1000) != sec ){
            sec = Math.floor(end/1000);
            console.log(sec);
        }
        end = Date.now() - start;
    }
}
sleep(5);
console.log("Done!");