function counter() {
  let count = 0;
  setInterval(() => {
    count++;
    console.log(count);
  }, 1000);
  console.log(count);
}
// counter();

// function counter() {
//   let count = 0;
//   let count2 = 0;
//   const startTime = Date.now();
//   setInterval(() => {
//     count++;
//     console.log(count);
//     console.log("Time:" + (Date.now() - startTime) / 1000);
//     for (let i = 0; i < 500000000; i++) {
//       count2 += i + count;
//     }
//     console.log(count2);
//   }, 1000);
//   console.log(count);
//   console.log("Time:" + (Date.now() - startTime) / 1000);
// }
// counter();

let count3 = 0;
setTimeout(() => console.log("200 Passed!"), 200);
setTimeout(() => console.log("100 Passed!"), 100);
for (let i = 0; i < 100000; i++) {
  count3 += i;
  console.log(i + ":" + count3);
}
console.log("Flow!");
