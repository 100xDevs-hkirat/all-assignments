var parentElement = document.getElementById("mainArea");
var currentChildren = Array.from(parentElement.children);

// console.log(currentChildren); // Initial children array

// Add a new child element to the parent element
var newChild = document.createElement("div");
// newChild.innerHTML = "This is div";
parentElement.appendChild(newChild);

currentChildren = Array.from(parentElement.children);
console.log(parentElement);
currentChildren[0].innerHTML = "This is added through the snapshot";
