// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)
function updateClock(){
    
    const now=new Date();
//get time for hours,minutes and seconds


    let hours12=now.getHours()%12||12;
    let minutes12=now.getMinutes();
    let seconds12=now.getSeconds();
    let ampm=now.getHours()>=12?'PM':'AM';  //find ampm

    let hours24=now.getHours();
    let minutes24=now.getMinutes();
    let seconds24=now.getSeconds();


//if the numbers are less than 10 then concatenate a 0 before the number
    hours12=hours12<10?'0'+hours12:hours12;
    minutes12=minutes12<10?'0'+minuter12:minutes12;
    seconds12=seconds12<10?'0'+seconds12:seconds12;

    hours24=hours24<10?'0'+hours24:hours24;
    minutes24=minutes24<10?'0'+minutes24:minutes24;
    seconds24=seconds24<10?'0'+seconds24:seconds24;

    console.log(`12-hour format:${hours12}:${minutes12}:${seconds24}`);
    console.log(`24 hour format:${hours24}:${minutes24}:${seconds24}`);
}
const counter=()=>{
    console.clear();
    updateClock();
}

setInterval(counter,1000);