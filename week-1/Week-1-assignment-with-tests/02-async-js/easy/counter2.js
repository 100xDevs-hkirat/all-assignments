var count = 0;

function Counter() {
  console.log(count);
  count += 1;
  setTimeout(Counter, 1000);
}

Counter();
