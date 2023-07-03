let count = 0;
function callTimeout() {
  setTimeout(() => {
    count++;
    console.log(count);
    callTimeout();
  }, 1000);
}
console.log(count);

callTimeout();
