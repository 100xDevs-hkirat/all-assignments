
let prevTodo = [];


const difference = (currTodos, prevTodos) => {
  const diff = [];

  for (let i of currTodos) {
    let flag = 0;
    for (let j of prevTodos) {
      if (j.id == i.id) {
        if (j.title != i.title) {
          diff.push({
            change: "title",
            title: {
              id: j.id,
              title: i.title
            }
          });
        }
        if (j.description != i.description) {
          diff.push({
            change: "description",
            description: {
              id: j.id,
              description: i.description
            }
          });
        }
        flag = 1;
      }
    }
    if (!flag) {
      diff.push({
        change: "add",
        toAdd: { ...i }
      });
    }


  }
  for (let i of prevTodos) {
    let flag = 0;
    for (let j of currTodos) {
      if (i.id == j.id) {
        flag = 1;
      }
    }
    if (!flag) {
      diff.push({
        change: "remove",
        toRemove: { ...i }
      })
    }
  }
  prevTodo = currTodos;
  return diff;
}

function createDomElements(data) {
  let mainArea = document.getElementById("mainArea");
  console.log(mainArea)
  const diff = difference(todos, prevTodo);
  for (let i of diff) {
    if (i.change == "add") {
      const todo = document.createElement("div");
      const titleSpan = document.createElement("span");
      const descSpan = document.createElement("span");
      const button = document.createElement("button");
      titleSpan.classList.add("title");
      descSpan.classList.add("description");
      button.classList.add("delete");
      titleSpan.innerHTML = i.toAdd.title + "  ";
      descSpan.innerHTML = i.toAdd.description + "  ";
      button.innerHTML = "Delete";
      todo.appendChild(titleSpan);
      todo.appendChild(descSpan);
      todo.appendChild(button);
      todo.setAttribute("id", i.toAdd.id);
      mainArea.appendChild(todo);
      continue;
    } if (i.change == "title") {
      const todo = document.getElementById(`${i.title.id}`);
      const title = todo.querySelector(".title");
      title.innerHtml = i.title.title;
      continue;
    } if (i.change == "description") {
      const todo = document.getElementById(`${i.title.id}`);
      const desc = todo.querySelector(".description");
      desc.innerHtml = i.description.description;
      continue;
    } if (i.change == "remove") {
      const todo = document.getElementById(i.toRemove.id);
      mainArea.removeChild(todo);
      continue;
    }
  }
  prevTodo = todos;
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i + 1
    })
  }

  createDomElements(todos)
}, 5000)





