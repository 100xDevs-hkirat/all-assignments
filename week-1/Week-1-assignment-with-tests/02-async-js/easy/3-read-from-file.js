// ## Reading the contents of a file

// Write code to read contents of a file and print it to the console. 
// You can use the fs library to as a black box, the goal is to understand async tasks. 
// Try to do an expensive operation below the file read and see how it affects the output. 
// Make the expensive operation more and more expensive and see how it affects the output. 

const fs = require('fs');

async function read(err, text) {
    if(err) {
        throw 'it is an error';
    }else {
        const data = await text;
        console.log('data : ', data);    
    }
}

fs.readFile('week-1/Week-1-assignment-with-tests/02-async-js/easy/text.txt','utf8',read);