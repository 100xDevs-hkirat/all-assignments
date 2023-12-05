// ## Write to a file
// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks.

var fs=require('fs');

var content="Some random content";

fs.writeFile('kiran.txt',content,'utf-8',(err)=>{
    if(err){
        console.log("Error while writing the file",err);
    }
    else{
        console.log("Successfully updated the file!");
    }
})