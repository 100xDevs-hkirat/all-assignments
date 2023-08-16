const fs = require('fs');

fs.readFile('3-read-from-file.md', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

for (let x = 1; x < 10000000000; x++);
