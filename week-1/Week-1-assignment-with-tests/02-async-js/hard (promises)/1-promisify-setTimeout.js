/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
    return new Promise((a) => {
        setTimeout(() => {
            a('What is This');
        }, n + 5000);
    },)
}
async function runn() {
    var aa = await wait(1000);
    console.log(aa);
}
runn()