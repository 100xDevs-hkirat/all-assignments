// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)
function print(){
    let currentDate = new Date();
    var answer = '';
    if(currentDate.getHours<12){
        answer = currentDate.getHours() + ":"+ currentDate.getMinutes() + ":"+ currentDate.getSeconds() + " AM"
    }else{
        answer = currentDate.getHours()-12 + ":"+ currentDate.getMinutes() + ":"+ currentDate.getSeconds() + " PM"
    }

    console.log(answer);
}
function clock(){
    console.clear();
    print();
}
setInterval(clock, 1000);