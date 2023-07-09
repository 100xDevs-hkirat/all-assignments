Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
clock that shows you the current machine time?

Can you make it so that it updates every second, and shows time in the following formats -

- HH:MM::SS (Eg. 13:45:23)

- HH:MM::SS AM/PM (Eg 01:45:23 PM)

<!-- Code Begins -->

function printTime(){
let currentDateTime = new Date();
let ans = currentDateTime.getHours() + ":" + currentDateTime.getMinutes() + ":" +
currentDateTime.getSeconds();
console.clear();
console.log(ans);
}

function altprintTime(){
let currentDateTime = new Date();
let timeInd = 'AM';
let hour = currentDateTime.getHours();
if(hour > 12){
hour -= 12;
hour = '0' + hour;
timeInd = 'PM';
}
let ans = hour + ":" + currentDateTime.getMinutes() + ":" +
currentDateTime.getSeconds() + " " + timeInd;
// console.clear();
console.log(ans);
}

setInterval(printTime, 1000);
setInterval(altprintTime, 1000);

<!-- Code Ends -->
