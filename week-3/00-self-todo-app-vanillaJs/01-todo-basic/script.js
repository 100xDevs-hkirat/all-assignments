const URL = "https://mw77l6-3000.csb.app";
const ROUTE = "/todos";
const todosUrl = URL + ROUTE;

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

const deleteItem = (id) => {
  fetchCall(
    `${todosUrl}/${id}`,
    (list) => {
      generateView();
    },
    "DELETE"
  );
};

const createElements = (list) => {
  if (list?.length === 0) {
    return null;
  }
  const listElement = document.getElementById("listElement");
  Array.from(listElement.children).forEach((child) => child.remove());

  list.map((item) => {
    const { title, completed, description, id } = item;

    const child1 = document.createElement("span");
    child1.innerHTML = title + " ";

    const child2 = document.createElement("description");
    child2.innerHTML = description + " ";

    const child3 = document.createElement("button");
    child3.innerHTML = "delete";
    child3.addEventListener("click", (event) => {
      deleteItem(id);
    });

    listElement.appendChild(child1);
    listElement.appendChild(child2);
    listElement.appendChild(child3);
    listElement.appendChild(document.createElement("br"));
  });
};

const populateViewWithJson = (populateCb) => {
  fetchCall(todosUrl, (list) => {
    if (list?.length === 0) {
      return null;
    }

    const preListElement = document.createElement("pre");
    preListElement.innerHTML = JSON.stringify(list, null, 2);
    const listElement = document.getElementById("listElement");
    Array.from(listElement.children).forEach((child) => child.remove());
    listElement.appendChild(preListElement);

    populateCb?.(true);
  });
};

const generateView = (populateCb) => {
  fetchCall(todosUrl, (data) => {
    createElements(data);
    populateCb?.(true);
  });
};

const addItem = () => {
  const newItem = getItemFromTextbox();

  fetchCall(
    todosUrl,
    (list) => {
      generateView();
    },
    "POST",
    JSON.stringify(newItem)
  );
};

generateView();
