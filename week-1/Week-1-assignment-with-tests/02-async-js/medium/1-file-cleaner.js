const fs = require('fs');

function removeExtraSpaces(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf-8');
    const contentWithoutSpaces = data.replace(/\s+/g, ' ');

    fs.writeFileSync(filename, contentWithoutSpaces, 'utf-8');
    console.log(`Extra spaces have been removed from ${filename}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

removeExtraSpaces('kiran.txt');
