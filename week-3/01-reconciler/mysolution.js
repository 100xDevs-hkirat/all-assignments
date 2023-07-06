let prev=[];
function create_dom(vDOM)
{
    let updatelen =  Math.min(prev.length,vDOM.length);
    let parent=document.getElementById('mydiv');
    for(let i=0;i<updatelen;i++)
    {
        parent.children[i].children[0].innerText=vDOM[i].title;
        parent.children[i].children[1].innerText=vDOM[i].description;
        parent.children[i].children[2].innerText="DELETE "+Math.floor(Math.random()*10+1);
    }
    if(prev.length<vDOM.length)    //add elements
    {
        for(let i=prev.length;i<vDOM.length ;i++)
        {
            let child=document.createElement('div');
            child.dataset.id=vDOM[i].id;
            let garandchild1=document.createElement('span');
            garandchild1.innerText=vDOM[i].title;
            let garandchild2=document.createElement('span');
            garandchild2.innerText=vDOM[i].description;
            let garandchild3=document.createElement('button');
            garandchild3.innerText="DELETE "+Math.floor(Math.random()*10+1);;
            child.appendChild(garandchild1);
            child.appendChild(garandchild2);
            child.appendChild(garandchild3);
            parent.appendChild(child);
        }
    }
    else                            //delete elements
        for( let i = prev.length-1;i>=vDOM.length ;i--)
            parent.removeChild(parent.children[i])
    prev=vDOM;
}

let virtualDOM=[];
setInterval(()=>{
    let todos=[];
    let render_count=Math.floor((Math.random()*10)+1);
    for(let i=0;i<render_count;i++)
    {
        todos.push({
            id:i,
            title:"Study, ",
            description:"master web dev. "
        });
    }
    virtualDOM=todos;
},200);

setInterval(()=>{
    create_dom(virtualDOM);
},1000);