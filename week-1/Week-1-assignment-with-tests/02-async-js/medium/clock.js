function timeClock(){

    var time = new Date();
    var ap = "AM"
    if(time.getHours() >= 12)
        ap = "PM"
    console.log("Current Time is: "+time.getHours()+":"+time.getMinutes()+ ":" + time.getSeconds() + " "+ ap)
    if(10>3)
        setTimeout(timeClock,1000)
}

setTimeout(timeClock,1000)