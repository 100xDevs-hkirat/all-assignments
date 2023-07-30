// ## Counter without setInterval

// Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.




let counter = 1;

function count(n) {
    function recurse() {
        console.clear();
        console.log('counter with recurse method : ', counter);
        counter += 1;
        n--;
        if(1 <= n) {
            setTimeout(recurse, 1000);
        }
    }
    
    setTimeout(recurse, 1000);
}

count(10);



































































// (Hint: setTimeout)