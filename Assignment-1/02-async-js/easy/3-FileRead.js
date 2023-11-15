const fs = require('fs');

function printfile(err, data){
    if(err){
        console.log("error");
        return 
    }
    console.log(data);
}
fs.readFile('a.txt' , 'utf8' , printfile);