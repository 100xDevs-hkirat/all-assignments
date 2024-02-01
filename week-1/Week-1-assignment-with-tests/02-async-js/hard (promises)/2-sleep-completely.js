/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
    return new Promise((res) => {
        setTimeout(() => {
            res("promise resolved");
        }, seconds * 1000);
    });
}

sleep(5).then(() => console.log("print after 3 seconds"));
