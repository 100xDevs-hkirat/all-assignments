// ## Reading the contents of a file

// Write code to read contents of a file and print it to the console. 
// You can use the fs library to as a black box, the goal is to understand async tasks. 
// Try to do an expensive operation below the file read and see how it affects the output. 
// Make the expensive operation more and more expensive and see how it affects the output. 
const fs = require('fs');

fs.readFile('num.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    var num = parseInt(data) + 10;
    console.log(num);
});
var sum = 0;
for(var i  = 0;i<10000000000;i++){
    sum = sum + i;
}
console.log(sum);
