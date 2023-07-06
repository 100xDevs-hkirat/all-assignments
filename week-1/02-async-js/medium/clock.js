let dt= new Date();
let hr=dt.getHours();
let mn=dt.getMinutes();
let sec=dt.getSeconds();
//24 hour clock
setInterval(() => {
    console.clear();
    sec+=1;
    if(sec===60)
    {
        sec=0;
        mn++;
        if(mn===60)
        {
            mn=0;
            hr++;
            if(hr===24)
                hr=0;
        }
    }
    let HH = hr.toString().padStart(2, '0');
    let MM = mn.toString().padStart(2, '0');
    let SS = sec.toString().padStart(2, '0');  
    console.log(`${HH}:${MM}:${SS}`);
},1000);

//12 hour clock
// let postfix= (hr>=12)?"PM":"AM";
// hr=(hr>=12)?(hr-12):hr;
// setInterval(() => {
//     console.clear();
//     sec+=1;
//     if(sec===60)
//     {
//         sec=0;
//         mn++;
//         if(mn===60)
//         {
//             mn=0;
//             hr++;
//             if(hr===12)
//             {
//                 hr=0;
//                 postfix=(postfix==="AM")?"PM":"AM";
//             }
//         }
//     }
//     let HH = hr.toString().padStart(2, '0');
//     let MM = mn.toString().padStart(2, '0');
//     let SS = sec.toString().padStart(2, '0');  
//     console.log(`${HH}:${MM}:${SS} ${postfix}`);
// },1000);