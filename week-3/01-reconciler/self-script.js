let stateData = [];

const renderRowData = (childElement, item) => {
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
};

function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  let added = 0,
    deleted = 0,
    updated = 0;

  data.forEach(function (item) {
    if (
      stateData.length === 0 ||
      !stateData.some((stateItem) => item.id === stateItem.id)
    ) {
      added++;
      // Create a new element
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id;

      renderRowData(childElement, item);
      parentElement.appendChild(childElement);
    } else {
      stateData.forEach((stateItem) => {
        if (!data.some((newItem) => newItem.id === stateItem.id)) {
          const childElement = document.querySelector(
            `[data-id="${stateItem.id}"]`
          );
          if (childElement) {
            deleted++;
            parentElement.removeChild(childElement);
          }
        } else if (item.id === stateItem.id) {
          if (JSON.stringify(item) !== JSON.stringify(stateItem)) {
            updated++;
            const childElement = document.querySelector(
              `[data-id="${stateItem.id}"]`
            );
            renderRowData(childElement, item);
          }
        }
      });
    }
  });

  stateData = data;

  console.log({ added, deleted, updated });
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
}, 5000);
