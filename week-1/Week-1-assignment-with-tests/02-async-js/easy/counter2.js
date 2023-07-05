const printTime = (time) => {
  console.clear();
  console.log(time);
  setTimeout(printTime, 1000, time + 1);
};
setTimeout(printTime, 1000, 0);
