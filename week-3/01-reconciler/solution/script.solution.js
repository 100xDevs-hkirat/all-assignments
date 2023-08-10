function callback(data) {
  const currentElement = Array.from(parentElement.children);

  var parentElement = document.getElementById("mainArea");
  parentElement.innerHTML = "";
  var added = 0,
    updated = 0,
    removed = 0;

  data.forEach((item) => {
    const existingElement = currentElement.find(
      (child) => child.dataset.id === String(item.id)
    );
    if (existingElement) {
      updated++;
      existingElement.children[0].innerHTML = item.title;
      existingElement.children[1].innerHTML = item.description;
      //Remove the existing element from the currentElement
      currentElement = currentElement.filter(
        (child) => child != existingElement
      );
    } else {
      added++;
      const childElement = document.createElement("div");
      childElement.dataset.id = item.id;

      const grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title;

      childElement.appendChild(grandChildElement1);

      parentElement.appendChild(childElement);
    }
  });
  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach(function (child) {
    removed++;
    parentElement.removeChild(child);
  });

  console.log(added);
  console.log(updated);
  console.log(removed);
}

window.setInterval(() => {
  const todos = [];

  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i + 1,
    });
  }
  callback(todos);
}, 5000);
