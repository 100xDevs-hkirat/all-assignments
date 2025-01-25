const fs = require('fs');

fs.writeFile('a.txt', 'This is the content written to the file.', 'utf-8', (error) => {
  if (error) {
    console.error('Error writing to file:', error);
    return;
  }
  console.log('File has been written successfully.');
});

console.log('This will execute before the write callback due to async nature.');


console.log('Starting expensive operation...');
let sum = 0;
for (let i = 0; i < 1e8; i++) {
  sum += i;
}
console.log('Expensive operation completed. Sum:', sum);

console.log('Code execution continues after write task is initiated.');
