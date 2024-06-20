function CurrentTime() {
  var timeNow = new Date();
  console.log(
    timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds()
  );
}
setInterval(CurrentTime, 1000);
function CurrentTime12Hrs() {
  var timeNow = new Date();
  var hh = timeNow.getHours();
  var ap = hh > 12 ? "PM" : "AM";
  if (hh > 12) {
    hh = hh - 12;
  }
  console.log(
    hh + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds() + " " + ap
  );
}
setInterval(CurrentTime12Hrs, 1000);
