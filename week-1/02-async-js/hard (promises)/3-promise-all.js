/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */


function waitOneSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("1sec success");
        },1000);
    })
}

function waitTwoSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("2sec success");
        },2000);
    })
}

function waitThreeSecond() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("3sec success");
        },3000);
    })
}

let start=new Date().getTime();
function calculateTime() {
    Promise.all([waitOneSecond(),waitTwoSecond(),waitThreeSecond()])
        .then((data)=>{
            console.log(data);
            console.log((new Date().getTime()-start)/1000," seconds elasped");
        })
        .catch((err) =>{
            console.error(err);
        });
}
calculateTime();


// This skeleton can also be used :-
// let promise1=waitOneSecond();
// let promise2=waitTwoSecond();
// let promise3=waitThreeSecond();
//
// function calculateTime() {
//     Promise.all([promise1,promise2,promise3])
//         .then()
//         .catch();
// }