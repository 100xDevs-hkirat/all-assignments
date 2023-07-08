//Create a counter in JavaScript

var count=1;
function counter(){
    console.clear();
    console.log(count);
    count++;
}

setInterval(counter, 1000);