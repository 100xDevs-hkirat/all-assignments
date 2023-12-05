/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n){
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve(`Promise resolved after ${n} seconds`);
        },n*1000);
    });

}

wait(5)
.then(result=>{
    console.log(result);
})
.catch(error=>{
    console.log(error);
})