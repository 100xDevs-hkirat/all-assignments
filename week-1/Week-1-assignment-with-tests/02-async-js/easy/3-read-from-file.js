// <!-- ## Reading the contents of a file

// Write code to read contents of a file and print it to the console. 
// You can use the fs library to as a black box, the goal is to understand async tasks. 
// Try to do an expensive operation below the file read and see how it affects the output. 
// Make the expensive operation more and more expensive and see how it affects the output.  -->

const fs = require('fs');

function readAndPrintFileContents(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
    } else {
      console.log('File contents:');
      console.log(data);

      // Simulate an expensive operation using setTimeout
      expensiveOperation();
      console.log("hi");
    }
  });
}


function expensiveOperation() {
  // Simulate an expensive operation that takes 2 seconds
  setTimeout(() => {
    console.log('Expensive operation completed.');
  }, 5000);
}

// Replace 'your-file-path.txt' with the actual path of the file you want to read
const filePath = 'GG.txt';

// Read and print the file contents
readAndPrintFileContents(filePath);

