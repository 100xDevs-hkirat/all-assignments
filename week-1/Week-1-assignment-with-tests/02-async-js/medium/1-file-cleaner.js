/*File cleaner
Read a file, remove all the extra spaces and write it back to the same file.

For example, if the file input was
hello     world    my    name   is       raman

After the program runs, the output should be
hello world my name is raman */

const fs= require('fs');

function cleaner(data){
    var a=data.split(' ');
    var ar='';
    for(var i=0;i< a.length;i++){
        if(a[i]!='')
            ar+=a[i]+' ';
    }
    return ar;
}

function fileWritten(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('DONE');
}

function fileRead(err, data){
    if(err){
        console.log(err);
        return;
    }
    var cdata= cleaner(data);
    fs.writeFile('file.txt', cdata, 'utf8', fileWritten)
}
fs.readFile('file.txt', 'utf8', fileRead);

