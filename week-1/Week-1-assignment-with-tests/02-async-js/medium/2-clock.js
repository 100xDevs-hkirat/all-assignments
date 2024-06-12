function printCurrent() {
    let time = new Date()
    const answer = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log(answer);
}
function printTime() {
    console.clear();
    printCurrent()
}
setInterval(printTime, 1000);
