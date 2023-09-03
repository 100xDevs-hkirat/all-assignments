let vDOM = [];

function createDOMElement() {
  let parentElement = document.getElementById("mainArea");

  let currentChildren = Array.from(parentElement.children);

  let added = 0,
    removed = 0,
    updated = 0,
    deleted = 0;
  for (var i = 0; i < currentChildren.length; i++) {
    let exists = -1;
    let index = -1;
    for (var j = 0; j < vDOM.length; j++) {
      if (currentChildren[i].id === vDOM[j].id) {
        exists = i;
        index = j;
        break;
      }
    }
    if (exists !== -1) {
      currentChildren[exists].children[0].innerHTML = vDOM[index].title;
      currentChildren[exists].children[1].innerHTML = vDOM[index].description;
      updated++;
    } else {
      const childElement = document.createElement("div");
      const grandChildElement1 = document.createElement("span");
      const grandChildElement2 = document.createElement("span");
      const grandChildElement3 = document.createElement("button");

      grandChildElement1.innerHTML = vDOM[i].title;
      grandChildElement2.innerHTML = vDOM[i].description;
      grandChildElement3.innerHTML = "Delete";
      grandChildElement3.setAttribute(
        "onclick",
        "deleteTodo(" + vDOM[i].id + ")"
      );

      childElement.appendChild(grandChildElement1);
      childElement.appendChild(grandChildElement2);
      childElement.appendChild(grandChildElement3);
      parentElement.appendChild(childElement);

      added++;
    }
  }
  currentChildren.forEach(function (child) {
    deleted++;
    parentElement.removeChild(child);
  });
  console.log(added);
  console.log(removed);
  console.log(updated);
}

function updateVirtualDom(data) {
  vDOM = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
    };
  });
  createDOMElement();
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym from 5",
      id: i + 1,
    });
  }

  updateVirtualDom(todos);
}, 5000);
