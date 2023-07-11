let counter = 1;

function printCounter() {
  console.clear();
  console.log(counter++);
  setTimeout(printCounter, 1000);
}

printCounter();
