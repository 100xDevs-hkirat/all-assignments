function createDOM(datas){
    let parentEL = document.querySelector('#mainArea')
  
    parentEL.innerHTML = ""
  
    let added = 0 
    datas.forEach(data => {
          added ++
          let childEl = document.createElement('div')
  
          let grandChildEl1 = document.createElement("span")
          grandChildEl1.innerHTML=data.title;
  
          let grandChildEl2 = document.createElement("span");
          grandChildEl2.innerHTML=data.description;
  
          let grandChildEl3 = document.createElement("button")
          grandChildEl3.innerHTML="Delete";
          grandChildEl3.setAttribute("onClick" , `deleteToDo(${data.id})`)
  
          childEl.append(grandChildEl1);
          childEl.append(grandChildEl2);
          childEl.append(grandChildEl3);
          // console.log(childEl)
  
          parentEL.append(childEl)
    })
  
    console.log(added)
    
  } 
  
  window.setInterval(()=> {
      const todo = [];
      for(let i = 0; i < Math.floor(Math.random() *100) ; i++ ){
      todo.push({
      title: "sanjay" , 
      description: "consiler" , 
      id: i + 1
      })
    }
  
    createDOM(todo)
  } , 5000)