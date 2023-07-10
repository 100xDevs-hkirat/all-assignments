
function createDomElements(data) {
  let add = 0, remove = 0; update = 0;
  console.log(data.length);
  var parentElement = document.getElementById("mainArea");

  let priviousElements = Array.from(parentElement.children);
  // Clear all existing children of the parentElement
  console.log(priviousElements);

  // Process each item in the data array
  data.forEach(function (item) {
    //find the existing childern in new data
    let existingChild = priviousElements.find((child) => {
      return child.dataset.id === String(item.id);
    });

    //if privious does exits
    if (existingChild) {
      update++;
      //update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;

      //now it's no more an privous childer remove it from privoisElements
      priviousElements = priviousElements.filter((child) => {
        return child !== existingChild;
      });
    } else {
      add++;
      //if it's an new childern
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete"
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);
    }
  });

  // remove the one's that are no more part of these thing
  priviousElements.forEach((child) => {
    remove++
    parentElement.removeChild(child);
  });

  console.log(add);
  console.log(update);
  console.log(remove);
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 1000); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i + 1
    })
  }

  createDomElements(todos)
}, 3000)
