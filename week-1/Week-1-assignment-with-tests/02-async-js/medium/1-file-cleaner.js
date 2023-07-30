// ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman
// ```

const fs = require('fs');

let cleaned = '';

async function read(err, result) {
    let data = '';
    if(err) {
        console.error('it is an error');
    }else {
        data += await result;
        cleaned += data.replace(/\s+/g, ' ').trim();
        fs.writeFile('week-1/Week-1-assignment-with-tests/02-async-js/medium/helper.txt',cleaned,'utf8',(err)=> {
            err ? console.log(err) : console.log('data cleaned succesfully');
        });
    }
}

fs.readFile('week-1/Week-1-assignment-with-tests/02-async-js/medium/helper.txt','utf8',read);


