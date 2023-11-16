/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Promise resolved afte ${seconds} seconds`);
        }, seconds * 1000);
    });
}

const waitInSecond = 3;

wait(waitInSecond)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log("Error", error);
    });