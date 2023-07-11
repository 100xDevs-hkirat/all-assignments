const fs = require('fs');

fs.appendFile('4-write-to-file.md', '\r\nhi', (err) => {
  if (err) console.error(err);
  else console.log('successful');
});
