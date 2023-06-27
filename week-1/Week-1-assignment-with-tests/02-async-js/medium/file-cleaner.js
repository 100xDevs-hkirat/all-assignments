const fs = require('fs');

function fileCleaner(str) {
  let array = str.split(" ");
  let i = array.length - 1;
  // while (i >= 0) {
  //   if (array[i] === "") {
  //     array.splice(i, 1);
  //   }
  //   i--;
  // }
  if(array[i].length === 0){

  }
  else{
    var out = array.join(" ");
  }
  
  fs.writeFile('medium/file1.txt',out,function(err) {
    if (err) {
      console.log(err);
      return;
    }
  
    console.log('File has been written successfully.');
  });
}

fs.readFile('medium/file1.txt', 'utf8', function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  fileCleaner(data);
});
