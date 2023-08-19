const fs = require('fs');

fs.readFile('input.txt', 'utf8', function (err, data) {
  if (err) {
    console.log('Error reading file:', err);
    return;
  }

  const cleanedData = data.replace(/\s+/g, ' ');

  fs.writeFile('output.txt', cleanedData, function (err) {
    if (err) {
      console.log('Error writing file:', err);
      return;
    }
    console.log('File written successfully.');
  });
});
