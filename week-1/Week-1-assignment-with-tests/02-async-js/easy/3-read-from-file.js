/*
## Reading the contents of a file

Write code to read contents of a file and print it to the console. 
You can use the fs library to as a black box, the goal is to understand async tasks. 
Try to do an expensive operation below the file read and see how it affects the output. 
Make the expensive operation more and more expensive and see how it affects the output. 
*/

const fs = require('fs');

fs.readFile('./3-read-from-file.js', 'utf8', (err, data) => {
  err && console.error(err);
  console.log(data);
});
expensiveOperaion();

function expensiveOperaion() {
  console.log('expensiveOperaion started');
  let sum = 0;
  for (let i = 0; i < 100; i++) {
    sum += i;
    console.log(`${i} ----> ${sum}`);
  }
  console.log('expensiveOperaion completed: ' + sum);
}
