
// What are u looking for?
// You'll get it on Friday you lazy porson
let vDom = [];

function createDomElements(existingDom, currentDom){

    var parentElement = document.getElementById('mainArea');

    let added = 0, updated = 0, deleted =0;

    currentDom.map(item=> {
        var existingItem = existingDom.find(oldItem => {
            return item.id === oldItem.id;
        });

        if(existingItem){
            updated++;

            var existingChild = document.querySelector(`[data-id]= ${item.id}`);
            existingChild.children[0].innerHTML = item.title;
            existingChild.children[1].innerHTML = item.description;
        }else{

            added++;
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; 

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

    existingDom.forEach(function(oldItem) {
        if(currentDom.some(item=> item.id === oldItem.id)){
            deleted++;
            var childToRemove = document.querySelector(`[data-id]= ${item.id}`);
            parentElement.remove(childToRemove);

        }
        
    });
}










function updateVirtualDom(data) {
  const existingDom = [...vDom];

  vDom = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      desription: item.description,
    };
  });
  createDomElements(existingDom, vDom);
}

window.setInterval(() => {
  let todo = [];

  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todo.push({
      id: i + 1,
      title: "go to gym",
      description: "go to gym from 5",
    });
  }

  updateVirtualDom(data);
}, 5000);