// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const formattedTime24 = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime12 = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${period}`;

    console.log("Time (24-hour format):", formattedTime24);
    console.log("Time (12-hour format):", formattedTime12);
}

function paZero(num) {
    return nu < 10 ?  `O${num}` : num;
}

setInterval(updateClock, 1000);