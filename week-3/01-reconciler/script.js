
// What are u looking for?
// You'll get it on Friday you lazy porson
var global_ids = [];
var new_ids = [];


function findArrayDifference(array1, array2) {
  return array1.filter((element) => !array2.includes(element));
}

function createDomElements(data) {
  // console.log(data.length);

  for(var i=0;i<data.length;i++){
    new_ids.push(data[i].id);
  }

  var To_be_removed = findArrayDifference(global_ids, new_ids);
  var to_be_added = findArrayDifference(new_ids, global_ids);

  // console.log("global_ids"); 

  // console.log(global_ids); 

  // console.log("new_ids");

  // console.log(new_ids);

  // console.log("To_be_removed");

  // console.log(To_be_removed);

  // console.log("to_be_added");

  // console.log(to_be_added);

  // console.log(to_be_added);

    var parentElement = document.getElementById("mainArea");
  
    for (var i = 0; i < To_be_removed.length; i++) {
      var childElementToRemove = parentElement.querySelector("[data-id='" + To_be_removed[i] + "']");
      if (childElementToRemove) {
        parentElement.removeChild(childElementToRemove);
      }
      global_ids.pop(To_be_removed[i]);
    }
    
    

  for(var i=0;i<to_be_added.length;i++){
    if(!global_ids.includes(to_be_added[i])){
      global_ids.push(to_be_added[i]);
      var item = to_be_added[i];

      var childElement = document.createElement("div");
      childElement.dataset.id = item; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete"
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item + ")")

      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);

    }
  }
  new_ids = [];
}

// Math.floor(Math.random() * 100)


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
// }, 1000)

