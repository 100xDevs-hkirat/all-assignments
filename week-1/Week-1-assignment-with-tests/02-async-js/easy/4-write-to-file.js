// <!-- ## Write to a file
// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks. -->

const fs = require('fs');

function writeToFile(filePath, content) {
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Successfully wrote to the file!');
    }
  });
}

// Replace 'your-file-path.txt' with the actual path of the file you want to write to
const filePath = 'gg.txt';

// Replace 'Your content goes here' with the content you want to write to the file
const contentToWrite = 'gg.txt';

// Write to the file
writeToFile(filePath, contentToWrite);
