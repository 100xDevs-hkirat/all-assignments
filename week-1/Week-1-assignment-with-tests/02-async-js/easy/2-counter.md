## Counter without setInterval

Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.

<!-- Code Begins -->

var counter = 1;

function printCounter(){
console.clear();
console.log(counter);
counter += 1;
setTimeout(printCounter, 1000);

}

setTimeout(printCounter, 1000);

<!-- Code End -->

(Hint: setTimeout)
