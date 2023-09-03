/*Write to a file
Using the fs library again, try to write to the contents of a file.
You can use the fs library to as a black box, the goal is to understand async tasks.*/

const fs= require('fs');

var data= "v1.1";

function updateContents(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('UPDATED');
}
fs.writeFile('updateme.txt', data, 'utf8', updateContents);