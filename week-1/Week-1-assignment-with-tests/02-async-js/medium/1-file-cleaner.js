const fs = require('fs');

fs.readFile('1-file-cleaner.md', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  fs.appendFile('1-file-cleaner.md', '\r\n' + clean(data), (err) => {
    if (err) console.error(err);
    else console.log('successful');
  });
});

function clean(str) {
  return str
    .split(' ')
    .filter((el) => el.length > 0)
    .join(' ');
}
