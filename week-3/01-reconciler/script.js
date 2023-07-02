
function createDomElements(todos) {
  const mainArea = document.getElementById("mainArea");
  let childrenOfMainArea = Array.from(mainArea.children);

  for(let todo of todos){
      let updatedTodo = childrenOfMainArea.find(child => child.dataset.id === todo.id);
      if(updatedTodo){
          updatedTodo.getElementById('title').innerHTML = todo.title;
          updatedTodo.getElementById('description').innerHTML = todo.description;

          // Remove the updatedTodo from the array of DOM elements
          childrenOfMainArea = childrenOfMainArea.filter((child) => {
              child !== updatedTodo;
          })
      }else{
          let childDiv = document.createElement('div');
          childDiv.dataset.id = todo.id;

          let titleSpan = document.createElement('span');
          titleSpan.setAttribute('id','title');
          titleSpan.innerHTML = todo.title;

          let descriptionSpan = document.createElement('span');
          titleSpan.setAttribute('id','description');
          descriptionSpan.innerHTML = todo.description;

          let deleteButton = document.createElement('button');
          deleteButton.innerHTML = 'Delete'
          deleteButton.setAttribute('onclick',`deleteTodo(${todo.id.toString()})`);

          childDiv.appendChild(titleSpan);
          childDiv.appendChild(descriptionSpan);
          childDiv.appendChild(deleteButton);

          mainArea.appendChild(childDiv);
      }
  }

  // Remaining todos 
  for(const child of childrenOfMainArea){
      mainArea.removeChild(child)
  }
}

window.setInterval(() => {
  let todos = [];
  for(let i=0;i<Math.floor(Math.random()*100);i++){
    todos.push({
      id:i,
      title:`title${i}`,
      description:`description${i}`
    })
  }
  createDomElements(todos);
},3000);