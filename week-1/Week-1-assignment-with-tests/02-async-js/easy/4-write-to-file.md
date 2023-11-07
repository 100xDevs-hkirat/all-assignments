## Write to a file

Using the fs library again, try to write to the contents of a file.
You can use the fs library to as a black box, the goal is to understand async tasks.

<!-- Code Begins -->

const fs = require('fs');

let dataToWrite = "Test data to display Async Functionality"

function update(err){
if(err){
console.log(err);
return;
}
console.log("File is Updated");
}

fs.writeFile('test.txt', dataToWrite, 'utf8', update);

<!-- Code Ends -->
