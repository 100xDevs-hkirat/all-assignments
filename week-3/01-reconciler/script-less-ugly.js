/** ==========================================================================================
 IN THIS FILE WE ARE GOING TO FIND THE DIFFERENCE DDOMS AND INSTED OF REMOVING AND ADDDING THE WHOLE DOM (WHICH IS VERY INEFFICIENT) WE WILL FIND THE DIFF AND ALOS JUST UPDATE THE CHANGES IN THE EXCISTING DOM , (THIS IS WHAT REACT DOES BEHIND THE SCENES).
 ========================================================================================== */


document.addEventListener('DOMContentLoaded', (event) => {
    var parentElement = document.getElementById("mainArea");
    console.log(parentElement);
    // Ensure no DOM manipulation code is placed before this log statement
});

// var parentElement = document.getElementById("mainArea");
function createDomElements(data) {
    var parentElement = document.getElementById("mainArea");
    console.log(parentElement);

    // Get the current children of the parent element and convert it to an array
    var currentChildren = Array.from(parentElement.children);
    console.log(currentChildren);

    let added = 0, deleted = 0, updated = 0;
    // Process each item in the data array
    data.forEach(function (item) {
        // Check if a child with this ID already exists
        var existingChild = currentChildren.find(function (child) {
            console.log(child.dataset.id);
            console.log(String(item.id));
            return child.dataset.id === String(item.id);
        });
        console.log(existingChild);

        if (existingChild) {
            updated++;
            // If it exists, update it

            existingChild.children[0].innerHTML = item.title;
            console.log(existingChild.children[0].innerHTML);
            existingChild.children[1].innerHTML = item.description;
            console.log(existingChild.children[1].innerHTML);

            // Remove it from the currentChildren array
            // currentChildren = currentChildren.filter(function(child) {
            //   console.log(child !== existingChild); //if existingChild is not equal to child, push to currentChildren, if equal, remove .
            //   console.log(currentChildren);
            //   return child !== existingChild;
            // });


// Assuming existingChild is defined somewhere above this code
// and currentChildren is an array of child elements

// Initialize an empty array to hold the filtered results
            var filteredChildren = [];

// Loop through each element in the currentChildren array
            for (var i = 0; i < currentChildren.length; i++) {
                console.log(currentChildren.length);
                console.log(currentChildren[i]);
                var child = currentChildren[i];

                // Check if the current child is not the existingChild
                if (child !== existingChild) {
                    console.log(child);
                    console.log(existingChild);
                    // If it's not the existingChild, add it to the filteredChildren array
                    filteredChildren.push(child);
                    console.log(filteredChildren);
                } else {
                    // Optionally, log the existingChild being removed
                    // This will only log when the existingChild is found
                    console.log("Removing existingChild:", child);
                }
            }

// After the loop, filteredChildren contains all elements except existingChild
// Reassign currentChildren to the new array without existingChild
            currentChildren = filteredChildren;

// At this point, currentChildren no longer includes existingChild


            console.log(currentChildren);
        } else {
            added++;
            // If it doesn't exist, create it
            var childElement = document.createElement("div");
            childElement.dataset.id = item.id; // Store the ID on the element for future lookups
            console.log(childElement.dataset.id);
            var grandChildElement1 = document.createElement("span");
            grandChildElement1.innerHTML = item.title
            console.log(grandChildElement1.innerHTML);

            var grandChildElement2 = document.createElement("span");
            grandChildElement2.innerHTML = item.description
            console.log(grandChildElement2.innerHTML);

            var grandChildElement3 = document.createElement("button");
            grandChildElement3.innerHTML = "Delete"
            grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

            childElement.appendChild(grandChildElement1)
            childElement.appendChild(grandChildElement2)
            childElement.appendChild(grandChildElement3)
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


// for (let i = 0; i < data.length; i++) {
//   let item = data[i];
//   let existingChild = null;

//   // Find existing child
//   for (let j = 0; j < currentChildren.length; j++) {
//     if (currentChildren[j].dataset.id === String(item.id)) {
//       existingChild = currentChildren[j];
//       break; // Stop searching once found
//     }
//   }

//   if (existingChild) {
//     updated++;
//     // Update existing child
//     existingChild.children[0].innerHTML = item.title;
//     existingChild.children[1].innerHTML = item.description;

//     // Remove the existing child from currentChildren
//     let tempChildren = [];
//     for (let k = 0; k < currentChildren.length; k++) {
//       if (currentChildren[k] !== existingChild) {
//         tempChildren.push(currentChildren[k]);
//       }
//     }
//     currentChildren = tempChildren;
//   } else {
//     added++;
//     // Create new child
//     let childElement = document.createElement("div");
//     childElement.dataset.id = item.id;
//     let grandChildElement1 = document.createElement("span");
//     grandChildElement1.innerHTML = item.title;
//     let grandChildElement2 = document.createElement("span");
//     grandChildElement2.innerHTML = item.description;
//     let grandChildElement3 = document.createElement("button");
//     grandChildElement3.innerHTML = "Delete";
//     grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")");
//     childElement.appendChild(grandChildElement1);
//     childElement.appendChild(grandChildElement2);
//     childElement.appendChild(grandChildElement3);
//     parentElement.appendChild(childElement);
//   }
// }

// // Remove any children left in currentChildren
// for (let i = 0; i < currentChildren.length; i++) {
//   deleted++;
//   parentElement.removeChild(currentChildren[i]);
// }

// console.log(added);
// console.log(updated);
// console.log(deleted);
// }


window.setInterval(() => {
    let todos = [];
    var todoGen = Math.floor(Math.random() * 10);
    console.log(todoGen);
    for (let i = 0; i < todoGen; i++) {
        todos.push({
            title: "Go to gym",
            description: "Go to gym form 5",
            id: i + 1
        })
    }
    console.log(todos);
    createDomElements(todos)
}, 5000)


// let todos = [];
// var todoGen = Math.floor(Math.random() * 10);
// console.log(todoGen);
// for (let i = 0; i < todoGen; i++) {
//   todos.push({
//     title: "Go to gym",
//     description: "Go to gym form 5",
//     id: i + 1
//   })
// }
// console.log(todos);
// createDomElements(todos);