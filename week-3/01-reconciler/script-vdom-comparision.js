let vDOM = []; // Our initial vDOM is an empty array

function createDomElements(existingDOM, currentDOM) {
  var parentElement = document.getElementById("mainArea");

  let added = 0, deleted = 0, updated = 0;

  // Now, we'll compare our new vDOM to our old vDOM
  currentDOM.forEach(function(item) {
    // Check if an element with this ID already exists in the old vDOM
    var existingItem = existingDOM.find(function(oldItem) {
      return oldItem.id === item.id;
    });

    if (existingItem) {
      updated++;
      // If it exists, update it
      var existingChild = document.querySelector(`[data-id='${item.id}']`);
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
    } else {
      added++;
      // If it doesn't exist in the DOM, create it
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title;

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description;

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete";
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")");

      childElement.appendChild(grandChildElement1);
      childElement.appendChild(grandChildElement2);
      childElement.appendChild(grandChildElement3);
      parentElement.appendChild(childElement);
    }
  });

  // Any item left in the existingDOM array no longer exist in the data, so remove them
  existingDOM.forEach(function(oldItem) {
    if (!currentDOM.some(item => item.id === oldItem.id)) {
      deleted++;
      var childToRemove = document.querySelector(`[data-id='${oldItem.id}']`);
      parentElement.removeChild(childToRemove);
    }
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

function updateVirtualDom(data) {
  let existingDOM = [...vDOM]; // Save the existing state of vDOM
  vDOM = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      description: item.description
    };
  });
  createDomElements(existingDOM, vDOM); // Pass the old and new vDOM to createDomElements
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i<Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym from 5",
      id: i+1
    })
  }

  updateVirtualDom(todos);
}, 5000);
