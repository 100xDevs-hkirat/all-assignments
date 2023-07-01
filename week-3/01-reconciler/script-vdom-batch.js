let vDOM = []; // Our initial vDOM is an empty array

function createDomElements() {
  var parentElement = document.getElementById("mainArea");

  var currentChildren = Array.from(parentElement.children);

  let added = 0, deleted = 0, updated = 0;
  // Now, we'll compare our new vDOM to our actual DOM
  vDOM.forEach(function(item) {
    // Check if a child with this ID already exists in the DOM
    var existingChild = currentChildren.find(function(child) {
      return child.dataset.id === String(item.id);
    });

    if (existingChild) {
      updated++;
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(function(child) {
        return child !== existingChild;
      });
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

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach(function(child) {
    deleted++;
    parentElement.removeChild(child);
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}


function updateVirtualDom(data) {
    vDOM = data.map(item => {
        return {
          id: item.id,
          title: item.title,
          description: item.description
        };
      });
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

window.setInterval(() => {
    createDomElements();
}, 1000);


