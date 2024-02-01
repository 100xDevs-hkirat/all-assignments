function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  // Get the current children of the parent element and convert this nodeList to a proper array
  var currentChildren = Array.from(parentElement.children);

  let added = 0,
    deleted = 0,
    updated = 0;
  // Process each item in the data array
  data.forEach(function (item) {
    // Check if a child with this ID already exists
    var existingChild = currentChildren.find(
      (child) => child.dataset.id === String(item.id)
    );

    if (existingChild) {
      updated++;
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(
        (child) => child !== existingChild
      );
    } else {
      added++;
      // If it doesn't exist, create it
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
  currentChildren.forEach((child) => {
    deleted++;
    parentElement.removeChild(child);
  });

  console.log("added", added);
  console.log("updated", updated);
  console.log("deleted", deleted);
}

let todos = [];

function deleteTodo(id) {
  console.log("deleteTodo", id);
  todos = todos.filter((todo) => todo.id !== id);
  createDomElements(todos);
}

window.setInterval(() => {
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: `Go to gym form ${i + 1}`,
      id: i + 1,
    });
  }

  createDomElements(todos);
}, 5000);
