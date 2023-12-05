var fs=require('fs');

fs.readFile('kiran.txt','utf-8',(err,data)=>{
  if(err) throw err;
  console.log(data);

});