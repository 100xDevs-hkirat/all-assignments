/*
File cleaner
Read a file, remove all the extra spaces and write it back to the same file.

For example, if the file input was
```
hello     world    my    name   is       raman
```

After the program runs, the output should be

```
hello world my name is raman
```
*/

const fs = require('fs');

fs.readFile('./file.txt', 'utf8', (err, data) => {
  err && console.error(err);
  console.log(data);
  const text = removeExtraSpace(data);
  writeFile(text);
});

function writeFile(text) {
  fs.writeFile('./file.txt', text, 'utf8', (err) => console.log(err));
}

const removeExtraSpace = (str) => str.replace(/\s+/g, ' ').trim();
