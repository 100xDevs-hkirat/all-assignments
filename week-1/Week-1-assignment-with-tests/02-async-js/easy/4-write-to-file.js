function printCurrentTime() {
    let currentDate = new Date();
    let simple;
    let ampm = '';
    if(currentDate.getHours() > 12) {
        simple = currentDate.getHours() - 12;
        ampm += " PM";
        console.log(simple+":"+currentDate.getMinutes()+":"+currentDate.getSeconds()+ampm);
    }else {
        ampm += " AM";
        console.log(currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds()+ampm);
    }
}

function printTime() {
    console.clear();
    printCurrentTime();
}

setInterval(printTime, 1000);