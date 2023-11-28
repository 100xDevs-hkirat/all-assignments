// <!-- ## Counter without setInterval

// Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck. -->

var count=1;

const counter=()=>{
    console.clear();
    console.log(count);
    count+=1;
    setTimeout(counter,1000);

}

counter();





































































// (Hint: setTimeout)