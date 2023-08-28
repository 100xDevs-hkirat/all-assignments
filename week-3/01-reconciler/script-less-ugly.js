function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");
  // Get the current children of the parent element and convert it to an array
  var currentChildren = Array.from(parentElement.children);

  console.log(currentChildren); // this are the existing data in the list

  let added = 0,
    deleted = 0,
    updated = 0;

  // Process each item in the data array
  // for(let i=0;i<data.length;i++){
  //   let item = data[i];
  // }      or data.forEach(funtion(item))

  data.forEach(function (item) {
    // Check if a child with this ID already exists
    var existingChild = currentChildren.find(function (child) {
      // return child.getAttribute("id") === String(item.id);
      childElement.dataset.id = item.id;//return child.dataset.id === String(item.id);// is used to check the current children is already exist with the id (childd.dataset.id)=new child with id (String(item.id))
      // dataset.id isi same as setattribute  is used to store the data which is ann id in html
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
      // If it doesn't exist, create it
      var childElement = document.createElement("div");

      //return child.getAttribute("id") === String(item.id);
      //or
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups or store the data in ur div elements

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

  //currentChildren.forEach(function(child) {
  //   var stillpresent = data.find(function(item){
  //     return child.dataset.id === string(item.id);
  //   });
  //   if (!stillpresent){
  //     deleted++;
  //     parentElement.removeChild(child);
  //   }
  // });
  //  or
  currentChildren.forEach(function (child) {
    deleted++;
    parentElement.removeChild(child);
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i + 1,
    });
  }

  createDomElements(todos);
}, 10000);
