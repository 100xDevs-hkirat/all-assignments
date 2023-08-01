// (Hint: setTimeout)
// ## Counter without setInterval

// Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.


function CounterUsingTimeout(counter) {
  console.clear();
  console.log(counter);
  counter = counter + 1;
  setTimeout(() => CounterUsingTimeout(counter), 100);
}

// Start the counter
CounterUsingTimeout(1);































































