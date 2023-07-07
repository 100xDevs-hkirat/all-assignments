const date = new Date();

let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();

// To show the Clock in Console
function showClockOnConsole(hours, minutes, seconds) {
    console.clear()

    let time = hours > 11 ? "PM" : "AM"

    // Changing Hours from 24Hr format to 12Hr Format
    hours = hours > 12 ? hours - 12 : hours

    // Adding Zero at the front of every number who is less than 10
    hours = (hours < 10) ? `0${hours}` : hours
    minutes = (minutes < 10) ? `0${minutes}` : minutes
    seconds = (seconds < 10) ? `0${seconds}` : seconds


    console.log(`${hours} : ${minutes} : ${seconds} ${time}`)
}


function clock() {

    showClockOnConsole(hours, minutes, seconds)

    seconds++

    if (seconds === 60) {
        minutes++
        seconds = 0
    }

    if (minutes === 60) {
        hours++;
        minutes = 0
    }

    if (hours === 24) {
        hours = 0
    }

    setTimeout(clock, 1000);
}


clock()