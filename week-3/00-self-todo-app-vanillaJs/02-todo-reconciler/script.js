const URL = "https://xknrrz-3000.csb.app";
const ROUTE = "/todos";
const todosUrl = URL + ROUTE;

const mainElement = document.getElementById("mainArea");

const getItemFromTextbox = () => ({
  title: document.getElementById("title").value,
  description: document.getElementById("description").value,
});
const fetchCall = (url, dataCb, method, data) => {
  const options = {
    method: method ? method : "GET",
    ...(data && {
      headers: { "Content-Type": "application/json" },
      body: data,
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      dataCb(data);
    });
};

const addItem = () => {
  const newItem = getItemFromTextbox();

  fetchCall(
    todosUrl,
    (list) => {
      // generateView();
    },
    "POST",
    JSON.stringify(newItem)
  );
};
const deleteItem = (id) => {
  fetchCall(
    `${todosUrl}/${id}`,
    (list) => {
      // generateView();
    },
    "DELETE"
  );
};
const updateItem = (id) => {
  const newItem = getItemFromTextbox();

  fetchCall(
    `${todosUrl}/${id}`,
    (list) => {
      // generateView();
    },
    "PUT",
    JSON.stringify(newItem)
  );
};

const generateInitialView = () => {
  const inputElements = document.createElement("div");
  inputElements.setAttribute("id", "inputElements");
  const listElement = document.createElement("div");
  listElement.setAttribute("id", "listElement");

  mainElement.appendChild(inputElements);
  mainElement.appendChild(listElement);
};

const createInputElements = () => {
  const inputElements = document.getElementById("inputElements");

  inputElements.innerHTML = "";

  // Create the title label
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title";

  // Create the title input field
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.placeholder = "title";

  // Create the description label
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description";

  // Create the description input field
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.id = "description";
  descriptionInput.placeholder = "description";

  // Create the add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add todo";
  addButton.onclick = addItem;

  // Append all the elements to the container
  inputElements.appendChild(titleLabel);
  inputElements.appendChild(titleInput);
  inputElements.appendChild(descriptionLabel);
  inputElements.appendChild(descriptionInput);
  inputElements.appendChild(addButton);
};

const repaintData = (list) => {
  if (list?.length === 0) {
    return null;
  }

  const listElement =
    document.getElementById("listElement") || document.createElement("div");
  listElement.setAttribute("id", "listElement");
  listElement.innerHTML = "";

  list.forEach((item) => {
    const { title, description, id } = item;

    const row = document.createElement("div");
    row.id = id;

    const child1 = document.createElement("span");
    child1.innerHTML = title + " ";
    child1.classList.add("title");

    const child2 = document.createElement("span");
    child2.innerHTML = description + " ";
    child2.classList.add("description");

    const child3 = document.createElement("button");
    child3.innerHTML = "delete";
    child3.addEventListener("click", (event) => {
      deleteItem(id);
    });

    row.appendChild(child1);
    row.appendChild(child2);
    row.appendChild(child3);
    listElement.appendChild(row);
  });

  mainElement.appendChild(listElement);
};

const reconcileData = (newList) => {
  if (newList?.length === 0) {
    return null;
  }

  const listElement = document.getElementById("listElement");

  const newIds = newList.map((newItem) => newItem.id);

  const currentIds = Array.from(listElement.children).map((row) => +row.id);

  // console.log({ newIds, currentIds });

  // Delete operation
  currentIds.forEach((currentId) => {
    if (!newIds.includes(currentId)) {
      listElement.removeChild(document.getElementById(currentId));
    }
  });

  newList.forEach((newItem) => {
    const { title, description, id } = newItem;

    // Add operation
    if (!currentIds.includes(id)) {
      const row = document.createElement("div");
      row.id = id;

      const child1 = document.createElement("span");
      child1.innerHTML = title;
      child1.classList.add("title");

      const child2 = document.createElement("span");
      child2.innerHTML = description;
      child2.classList.add("description");

      const child3 = document.createElement("button");
      child3.innerHTML = "delete";
      child3.addEventListener("click", (event) => {
        deleteItem(id);
      });

      const child4 = document.createElement("button");
      child4.innerHTML = "update";
      child4.addEventListener("click", (event) => {
        updateItem(id);
      });

      row.appendChild(child1);
      row.appendChild(document.createTextNode(" "));
      row.appendChild(child2);
      row.appendChild(document.createTextNode(" "));
      row.appendChild(child3);
      row.appendChild(document.createTextNode(" "));
      row.appendChild(child4);
      listElement.appendChild(row);
    }
    // Update operation
    else {
      Array.from(listElement.children).forEach((row) => {
        if (+row.id === id) {
          // Update operation

          const currentTitle = row.querySelector(".title").innerHTML;
          const currentDescription =
            row.querySelector(".description").innerHTML;

          if (currentTitle !== title) {
            row.querySelector(".title").innerHTML = title;
          }

          if (currentDescription !== description) {
            row.querySelector(".description").innerHTML = description;
          }
        }
      });
    }
  });

  mainElement.appendChild(listElement);
};

const generateView = (populateCb) => {
  fetchCall(todosUrl, (data) => {
    reconcileData(data);
    populateCb?.(true);
  });
};

window.setInterval(() => {
  console.log("generated view");
  generateView();
}, 1000);

generateInitialView();
createInputElements();
// generateView();
