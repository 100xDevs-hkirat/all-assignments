// <!-- ## Write to a file -->
// <!-- Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks. -->

const fs = require('fs');
const writeData = ' \n writing the data using fs package';

async function write(err) {
    if(err) {
        throw 'it is an error';
    }
    console.log('the file is written succesfully :) ');
}

fs.writeFile('week-1/Week-1-assignment-with-tests/02-async-js/easy/text.txt',writeData,'utf8',write);