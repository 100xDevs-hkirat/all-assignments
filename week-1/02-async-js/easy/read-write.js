//write
const fs = require('fs');
let content="Need to complete the assignment asap.";
let path='read-write.txt';
fs.writeFile(path,content,'utf-8', (err) => {
    if(err)
        console.error(err);
});

//read
fs.readFile(path,'utf-8',(err,data) => {
    if(err)
        console.error(err);
    else
        console.log(data);
});

console.log("sync begin");
for(let i=0;i<10000000000;i++);
console.log("sync end");