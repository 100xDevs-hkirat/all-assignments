const fs = require('fs');


function cleanFile(filePath) {

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

 
    const cleanedData = data.replace(/\s+/g, ' ').trim();

    fs.writeFile(filePath, cleanedData, 'utf-8', (err) => {
      if (err) {
        console.error('Error writing to the file:', err);
        return;
      }
      console.log('File has been cleaned successfully!');
    });
  });
}

cleanFile('input.txt');
