/*
    Write a function that returns a promise that resolves after n seconds have passed, 
    where n is passed as an argument to the function.
*/

function wait(n) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },n*1000)
    });
}

async function logTimer(){
    console.log(`Start: ${new Date()}`);

    /*
    wait(5).then(()=>{
        console.log(`End: ${new Date()}`);
    })
    */

    await wait(5);
    console.log(`End: ${new Date()}`);
}

logTimer()