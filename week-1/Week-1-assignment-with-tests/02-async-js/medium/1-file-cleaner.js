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
function filePath(fPath){
    fs.readFile(fPath, 'utf-8', (err,data)=>{
    if(err){
        console.log("Error has been found.")
    }
    else {
        const cleanedData = data.replace(/\s+/g, ' ');
    
    fs.writeFile(fPath, cleanedData, 'utf-8', (err)=>{
        if(err){
            console.log("Error");
        }
        else{
            console.log("file is succefully cleaned");
        }
    });
    }
});
}

const gPath = 'gg.txt';
filePath(gPath);
