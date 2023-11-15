const fs = require('fs');

function cleaner(clean){
    var arr = clean.split(" ");
    var ans=[];
    for(let i=0;  i<arr.length ; i++){
        if(arr[i]==''){}
        else{
            ans.push(arr[i]);
        }
    }
    var ret = ans.join(" ");
    return ret;

}

function writefile(err){
    if(err){
        console.log("There was error encountered");
    }
    console.log("File has been Updated");
}

function readfile(err, data){
    if(err){
        console.log("Error");
        return 
    }
    var clean =data;
    clean = cleaner(clean);
    fs.writeFile('a.txt' , clean ,  'utf-8' , writefile);
}

fs.readFile('a.txt' , 'utf-8' , readfile);
