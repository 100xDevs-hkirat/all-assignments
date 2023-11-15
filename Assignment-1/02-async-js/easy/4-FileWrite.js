const fw = require('fs');

function read(err){
    if(err){
        console.log("error");
        return 
    }
    console.log("File is updated");
}
let val = "This is Anurag";
fw.writeFile('a.txt' , val , 'utf-8' , read);