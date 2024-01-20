/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
    const pr = new Promise((res, _) => {
        console.log("resolved");
        setTimeout(() => {
            res("promise resolved");
        }, n * 1000);
    });
    return pr;
}
wait(5).then((data) => console.log(data));
