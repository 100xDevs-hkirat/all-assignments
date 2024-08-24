// let vDOM = []; // Our initial vDOM is an empty array

// function createDomElements() {
//   var parentElement = document.getElementById("mainArea");
//   console.log(parentElement);

//   var currentChildren = Array.from(parentElement.children);
//   consoel.log(currentChildren);

//   let added = 0, deleted = 0, updated = 0;
//   // Now, we'll compare our new vDOM to our actual DOM
//   vDOM.forEach(function(item) {
//     // Check if a child with this ID already exists in the DOM
//     var existingChild = currentChildren.find(function(child) {\
//       console.log(child.dataset.id);
//       console.log(String(item.id));
//       return child.dataset.id === String(item.id);
//     });
//     console.log(existingChild);
//     if (existingChild) {
//       updated++;
//       // If it exists, update it
//       existingChild.children[0].innerHTML = item.title;
//       existingChild.children[1].innerHTML = item.description;
//       // Remove it from the currentChildren array
//       currentChildren = currentChildren.filter(function(child) {
//         return child !== existingChild;
//       });
//     } else {
//       added++;
//       // If it doesn't exist in the DOM, create it
//       var childElement = document.createElement("div");
//       childElement.dataset.id = item.id; // Store the ID on the element for future lookups

//       var grandChildElement1 = document.createElement("span");
//       grandChildElement1.innerHTML = item.title;

//       var grandChildElement2 = document.createElement("span");
//       grandChildElement2.innerHTML = item.description;

//       var grandChildElement3 = document.createElement("button");
//       grandChildElement3.innerHTML = "Delete";
//       grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")");

//       childElement.appendChild(grandChildElement1);
//       childElement.appendChild(grandChildElement2);
//       childElement.appendChild(grandChildElement3);
//       parentElement.appendChild(childElement);
//     }
//   });

//   // Any children left in the currentChildren array no longer exist in the data, so remove them
//   currentChildren.forEach(function(child) {
//     deleted++;
//     parentElement.removeChild(child);
//   });

//   console.log(added);
//   console.log(updated);
//   console.log(deleted);
// }


// function updateVirtualDom(data) {
//     vDOM = data.map(item => {
//         return {
//           id: item.id,
//           title: item.title,
//           description: item.description
//         };
//       });
//       console.log(vDOM);
//     createDomElements(vDOM);
// }
// window.setInterval(() => {
//   let todos = [];
//   let todoGen = Math.floor(Math.random() * 100);
//   consoel.log(todoGen);
//   for (let i = 0; i < todoGen; i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym from 5",
//       id: i+1
//     })
//   }
// console.log(todos);
//   updateVirtualDom(todos);
// }, 5000);



/**
 *THIS IS SIMILAR TO SCRIPT LESS UGLY BUT INSTEAD OF USING THE DATA DIRECTLY ONE BY ONE WE HERE STORING THE DATA IN A VARIABLE CALLED THE VIRTUAL DOM TO UPDATE THE DATA AND THEN UPDATE THE DOM.
 */




let vDOM = []; // Our initial vDOM is an empty array

function createDomElements() {
  var parentElement = document.getElementById("mainArea");
  console.log("Parent Element:", parentElement);

  var currentChildren = Array.from(parentElement.children);
  console.log("Current Children:", currentChildren);

  let added = 0, deleted = 0, updated = 0;
  // Now, we'll compare our new vDOM to our actual DOM
  vDOM.forEach(function(item) {
    console.log("Processing item from vDOM:", item);
    // Check if a child with this ID already exists in the DOM
    var existingChild = currentChildren.find(function(child) {
      console.log("Checking child with ID:", child.dataset.id, "against item ID:", String(item.id));
      return child.dataset.id === String(item.id);
    });
    console.log("Existing Child:", existingChild);
    if (existingChild) {
      updated++;
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      console.log("Updated existing child with new data:", existingChild);
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(function(child) {
        return child !== existingChild;
      });
      console.log("Filtered currentChildren after update:", currentChildren);
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
      console.log("Added new child element to DOM:", childElement);
    }
  });

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach(function(child) {
    deleted++;
    parentElement.removeChild(child);
    console.log("Removed child no longer in vDOM:", child);
  });

  console.log("Added:", added, "Updated:", updated, "Deleted:", deleted);
}

function updateVirtualDom(data) {
    vDOM = data.map(item => {
        return {
          id: item.id,
          title: item.title,
          description: item.description
        };
      });
      console.log("Updated vDOM:", vDOM);
    createDomElements(vDOM);
}

window.setInterval(() => {
  let todos = [];
  let todoGen = Math.floor(Math.random() * 10);
  console.log("Generated todo count:", todoGen);
  for (let i = 0; i < todoGen; i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym from 5",
      id: i+1
    });
  }
  console.log("Generated todos:", todos);
  updateVirtualDom(todos);
}, 5000);