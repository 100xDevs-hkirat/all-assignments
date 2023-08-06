/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
*/
function sum(a,b){
    var total = 1;
    for(var i = a ; i<=b;i++){
        total++;
    }
    console.log(total)
}

function calculateTime() {
   var start1= Date.now()
   sum(1,100)
   var end1 = Date.now()
   console.log(`For sum 1-100 time is ${end1-start1}`)
   var start2= Date.now()
   sum(1,100000)
   var end2 = Date.now()
   console.log(`For sum 1-100 time is ${end2-start2}`)
   var start3= Date.now()
   sum(1,1000000000)
   var end3 = Date.now()
   console.log(`For sum 1-100 time is ${end3-start3}`)
}
calculateTime()
