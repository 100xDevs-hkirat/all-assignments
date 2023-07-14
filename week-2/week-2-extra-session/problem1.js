// Write a function 'higherOrderAsync' that takes a callback function as an argument.
// Inside 'higherOrderAsync', call the callback function asynchronously using setTimeout after
// a delay of n seconds, where n is current day of
// the month according to UTC time (1 <= n <= 31)

const higherOrderAsync = (callbackFn) => {
  const n = new Date().getDate();
  setTimeout(() => {
    callbackFn(`executed after ${n} seconds`);
  }, n * 1000);
};

higherOrderAsync((msg) => {
  console.log(msg);
});
