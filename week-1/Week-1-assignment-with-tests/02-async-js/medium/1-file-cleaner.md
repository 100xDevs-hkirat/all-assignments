## File cleaner

Read a file, remove all the extra spaces and write it back to the same file.

For example, if the file input was

```
hello     world    my    name   is       raman
```

After the program runs, the output should be

```
hello world my name is raman
```

<!-- Code Begins -->

const fs = require('fs');

function cleanedData(data){
let arr = data.split(" ");
let ans = [];
for(let i=0; i<arr.length; i++){
if(arr[i] != ''){
ans.push(arr[i]);
}
}
let cleanedString = ans.join(" ");
return cleanedString;
}

function update(err){
console.log("Done");
}

function readFromFile(err,data){
if(err){
console.log(err);
return;
}
let cleanData = cleanedData(data);
fs.writeFile('test.txt', cleanData, 'utf8', update);
}

fs.readFile('test.txt', 'utf8', readFromFile);

<!-- Code Ends -->
