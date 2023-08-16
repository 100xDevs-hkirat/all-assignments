const date = new Date();
let hour = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();

setInterval(updateTime, 1000);

function updateTime() {
  sec++;
  if (sec > 59) {
    sec = 0;
    min++;
    if (min > 59) {
      min = 0;
      hour++;
      if (hour > 23) {
        hour = 0;
      }
    }
  }
  console.clear();
  console.log(`${hour}:${min}:${sec}`);
  console.log(
    `${String(hour > 12 ? hour - 12 : hour).padStart(2, '0')}:${min}:${sec} ${
      hour >= 12 ? 'PM' : 'AM'
    }`
  );
}
