const fs = require('fs');

let path = 'data.txt';
fs.readFile(path,'utf-8',(err,data) => {
    if(err)
        console.error(err);
    else
    {
        let in_data=data.trim();
        let arr=in_data.split(" ");
        let out_data="";
        if(arr.length>0)
        {
            out_data=arr[0];
            for(let i=1;i<arr.length;i++)
            {
                if(arr[i]!=='')
                    out_data=out_data.concat(' ',arr[i]);
            }
        }
        fs.writeFile(path,out_data,'utf-8', (err) => {
            if(err)
                console.error(err);
        })
    }
});