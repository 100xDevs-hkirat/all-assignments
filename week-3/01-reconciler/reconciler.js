const getRandomNumberOfTodos = () => {
  const todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
    todos.push({
      id: i,
      title: `My Todo - ${i}`,
      description: `This is the description of the todo -${i}`
    });
  }

  return todos;
};

const getTodoElement = (item) => {
  const todos = document.createElement('div');
  todos.dataset.id = item.id;

  const title = document.createElement('span');
  title.innerHTML = item.title;

  const description = document.createElement('span');
  description.innerHTML = item.description;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'Delete';
  deleteBtn.setAttribute('onClick', 'delete(' + item.id + ')');

  todos.appendChild(title);
  todos.appendChild(description);
  todos.appendChild(deleteBtn);

  return todos;
};

const createDomElements = (todos) => {
  //Get the existing parentElement
  const parentElement = document.getElementById('mainArea');
  //Get all the childrens for the parentElement
  let parentElementChildren = Array.from(parentElement.children);

  //Here we are utilizing the todos array which has provided to us to understand if it already exist in parentElement.
  //If it exists then simply update its details otherwise add new element in the parentElement.
  todos.forEach((item) => {
    const existingElement = parentElementChildren.find(
      (element) => element.dataset.id === item.id
    );

    if (existingElement) {
      const titleElement = existingElement.children[0];
      titleElement.innerHTML = item.title;

      const titleDescription = existingElement.children[1];
      titleDescription.innerHTML = item.titleDescription;

      parentElementChildren = parentElementChildren.filter(
        (element) => element !== item
      );
    } else {
      parentElement.appendChild(getTodoElement(item));
    }
  });
  parentElementChildren.forEach((child) => {
    parentElement.removeChild(child);
  });
};

const main = () => {
  window.setInterval(() => {
    const todos = getRandomNumberOfTodos();
    createDomElements(todos);
  }, 2000);
};

main();
