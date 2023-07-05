// Method 1: to empty the mainArea and then add all the elements again

// function createDomElements(data) {
//   var parentElement = document.getElementById("mainArea");

//   // Clear all existing children of the parentElement
//   parentElement.innerHTML = '';

//   let added = 0;
//   // Process each item in the data array
//   data.forEach(function(item) {
//     added++;
//     // Create a new element
//     var childElement = document.createElement("div");
//     childElement.dataset.id = item.id; // Store the ID on the element for future lookups

//     var grandChildElement1 = document.createElement("span");
//     grandChildElement1.innerHTML = item.title

//     var grandChildElement2 = document.createElement("span");
//     grandChildElement2.innerHTML = item.description

//     var grandChildElement3 = document.createElement("button");
//     grandChildElement3.innerHTML = "Delete"
//     grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

//     childElement.appendChild(grandChildElement1)
//     childElement.appendChild(grandChildElement2)
//     childElement.appendChild(grandChildElement3)
//     parentElement.appendChild(childElement);
//   });

//   console.log(added);
// }

// window.setInterval(() => {
//   let todos = [];
//   for (let i = 0; i<Math.floor(Math.random() * 100); i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym form 5",
//       id: i+1
//     })
//   }

//   createDomElements(todos)
// }, 5000)

// Method 2: less Ugly

// function createDomElements(data) {
//   var parentElement = document.getElementById("mainArea");

//   // Get the current children of the parent element and convert it to an array
//   var currentChildren = Array.from(parentElement.children);

//   let added = 0, deleted = 0, updated = 0;
//   // Process each item in the data array
//   data.forEach(function(item) {
//     // Check if a child with this ID already exists
//     var existingChild = currentChildren.find(function(child) {
//       return child.dataset.id === String(item.id);
//     });

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
//       // If it doesn't exist, create it
//       var childElement = document.createElement("div");
//       childElement.dataset.id = item.id; // Store the ID on the element for future lookups

//       var grandChildElement1 = document.createElement("span");
//       grandChildElement1.innerHTML = item.title

//       var grandChildElement2 = document.createElement("span");
//       grandChildElement2.innerHTML = item.description

//       var grandChildElement3 = document.createElement("button");
//       grandChildElement3.innerHTML = "Delete"
//       grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

//       childElement.appendChild(grandChildElement1)
//       childElement.appendChild(grandChildElement2)
//       childElement.appendChild(grandChildElement3)
//       parentElement.appendChild(childElement);
//     }
//   });

//   // Any children left in the currentChildren array no longer exist in the data, so remove them
// currentChildren.forEach(function (child) {
//   var stillPresent = data.find(function (item) {
//     return child.dataset.id === String(item.id);
//   });
//   if (!stillPresent) {
//     deleted++;
//     parentElement.removeChild(child);
//   }
// });

// window.setInterval(() => {
//   let todos = [];
//   for (let i = 0; i<Math.floor(Math.random() * 100); i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym form 5",
//       id: i+1
//     })
//   }

//   createDomElements(todos)
// }, 5000)

// Method 3: VDOM

// let vDOM = []; // Our initial vDOM is an empty array

// function createDomElements() {
//   var parentElement = document.getElementById("mainArea");

//   var currentChildren = Array.from(parentElement.children);

//   let added = 0,
//     deleted = 0,
//     updated = 0;
//   // Now, we'll compare our new vDOM to our actual DOM
//   vDOM.forEach(function (item) {
//     // Check if a child with this ID already exists in the DOM
//     var existingChild = currentChildren.find(function (child) {
//       return child.dataset.id === String(item.id);
//     });

//     if (existingChild) {
//       updated++;
//       // If it exists, update it
//       existingChild.children[0].innerHTML = item.title;
//       existingChild.children[1].innerHTML = item.description;
//       // Remove it from the currentChildren array
//       currentChildren = currentChildren.filter(function (child) {
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
//   currentChildren.forEach(function (child) {
//     deleted++;
//     parentElement.removeChild(child);
//   });

//   console.log(added);
//   console.log(updated);
//   console.log(deleted);
// }

// function updateVirtualDom(data) {
//   vDOM = data.map((item) => {
//     return {
//       id: item.id,
//       title: item.title,
//       description: item.description,
//     };
//   });
//   createDomElements(vDOM);
// }
// window.setInterval(() => {
//   let todos = [];
//   for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym from 5",
//       id: i + 1,
//     });
//   }

//   updateVirtualDom(todos);
// }, 5000);

// Method 4: VDOM with comparison

// let vDOM = []; // Our initial vDOM is an empty array

// function createDomElements(existingDOM, currentDOM) {

//   let added = 0,
//     deleted = 0,
//     updated = 0;

//   // Now, we'll compare our new vDOM to our old vDOM
//   currentDOM.forEach(function (item) {
//     // Check if an element with this ID already exists in the old vDOM
//     var existingItem = existingDOM.find(function (oldItem) {
//       return oldItem.id === item.id;
//     });

//     if (existingItem) {
//       updated++;
//       // If it exists, update it
//       var existingChild = document.querySelector(`[data-id='${item.id}']`);
//       existingChild.children[0].innerHTML = item.title;
//       existingChild.children[1].innerHTML = item.description;
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
//       var parentElement = document.getElementById("mainArea");
//       parentElement.appendChild(childElement);
//     }
//   });

//   // Any item left in the existingDOM array no longer exist in the data, so remove them
//   existingDOM.forEach(function (oldItem) {
//     if (!currentDOM.some((item) => item.id === oldItem.id)) {
//       deleted++;
//       var childToRemove = document.querySelector(`[data-id='${oldItem.id}']`);
//       parentElement.removeChild(childToRemove);
//     }
//   });

//   console.log(added);
//   console.log(updated);
//   console.log(deleted);
// }

// function updateVirtualDom(data) {
//   let existingDOM = [...vDOM]; // Save the existing state of vDOM
//   vDOM = data.map((item) => { //
//     return {
//       id: item.id,
//       title: item.title,
//       description: item.description,
//     };
//   });
//   createDomElements(existingDOM, vDOM); // Pass the old and new vDOM to createDomElements
// }

// window.setInterval(() => {
//   let todos = [];
//   for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
//     todos.push({
//       title: "Go to gym",
//       description: "Go to gym from 5",
//       id: i + 1,
//     });
//   }

//   updateVirtualDom(todos);
// }, 5000);

// Method 5: VDOM with batched updates

let vDOM = []; // Our initial vDOM is an empty array

function createDomElements() {
  var parentElement = document.getElementById("mainArea");

  var currentChildren = Array.from(parentElement.children);

  let added = 0,
    deleted = 0,
    updated = 0;
  // Now, we'll compare our new vDOM to our actual DOM
  vDOM.forEach(function (item) {
    // Check if a child with this ID already exists in the DOM
    var existingChild = currentChildren.find(function (child) {
      return child.dataset.id === String(item.id);
    });

    if (existingChild) {
      updated++;
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(function (child) {
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
  currentChildren.forEach(function (child) {
    deleted++;
    parentElement.removeChild(child);
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

function updateVirtualDom(data) {
  vDOM = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
    };
  });
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

window.setInterval(() => {
  createDomElements();
}, 1000);
