// ## Counter without setInterval

// Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.


///Here we are not using  setInterval but setTimeout ,it will run after 1 seconds

function counter() {
    console.log("Hello");
    setTimeout(counter, 1000);
}
counter()




































































// (Hint: setTimeout)