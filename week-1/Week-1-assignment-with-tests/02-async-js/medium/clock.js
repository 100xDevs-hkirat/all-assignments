// clock in javascript
setInterval(() => {
    const date = new Date();
    hours = date.getHours()%12 || 12;
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    console.log(`${hours}:${minutes}:${seconds}`)
}, 1000)
