let vDOM = [];

function createDomElements(existingDOM, currDOM) {
  var parentEle = document.getElementById("mainArea");
  let added = 0,
    deleted = 0,
    updated = 0;

  currDOM.forEach((item) => {
    var existingItem = existingDOM.find((oldItem) => oldItem.id === item.id);

    if (existingItem) {
      updated++;
      var existingChild = document.querySelector(`[data-id='${item.id}']`);
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
    } else {
      added++;

      var childEle = document.createElement("div");
      childEle.dataset.id = item.id;

      var grandChildEle1 = document.createElement("span");
      grandChildEle1.innerHTML = item.title;

      var grandChildEle2 = document.createElement("span");
      grandChildEle2.innerHTML = item.description;

      var grandChildEle3 = document.createElement("button");
      grandChildEle3.innerHTML = "delete";
      grandChildEle3.setAttribute("onclick", "deleteTodo(" + item.id + ")");

      childEle.append(grandChildEle1, grandChildEle2, grandChildEle3);
      parentEle.appendChild(childEle);
    }
  });

  // delete old elements that no longer exists
  existingDOM.forEach((oldItem) => {
    if (!currDOM.some((item) => item.id === oldItem.id)) {
      deleted++;
      var childToRemove = document.querySelector(`[data-id='${oldItem.id}']`);
      parentEle.removeChild(childToRemove);
    }
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}

// function updateVirtualDom(data) {
//     let existingDOM = [...vDOM]; // save the existing state of vDOM??
//     vDOM = data.map(item => {
//         return {
//             id: item.id,
//             title: item.title,
//             description: item.description
//         };
//     });
//     createDomElements(existingDOM, vDOM);
// }

function updateVirtualDom(data) {
    let tmp = [...vDOM];
    vDOM = data;
    createDomElements(tmp, vDOM);
}

window.setInterval(() => {
    let todos = [];
    for (let i = 0; i<Math.floor(Math.random() * 100); i++) {
        todos.push({
            id: i+1,
            title: "hii",
            description: "Orewa Monkey D. Luffy",
        });
    }
    updateVirtualDom(todos);
}, 5000);