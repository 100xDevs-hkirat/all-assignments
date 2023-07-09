## Reading the contents of a file

Write code to read contents of a file and print it to the console.
You can use the fs library to as a black box, the goal is to understand async tasks.
Try to do an expensive operation below the file read and see how it affects the output.
Make the expensive operation more and more expensive and see how it affects the output.

<!-- Code Begins -->

const fs = require('fs');

function printFromFile(err, data){
if(err){
console.log(err);
return;
}
console.log(data);
}

fs.readFile('test.txt', 'utf8', printFromFile);

var counter = 1;

for(var i=0; i<10000000000; i++) counter += 1;

console.log(counter);

<!-- Code Ends -->
