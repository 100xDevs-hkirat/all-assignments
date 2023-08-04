import { useState } from "react";
import "./App.css";

function deleteTodo(id) {
  console.log("deleted");
  console.log(id);

  fetch("http://localhost:3000/todos" + id, {
    method: "DELETE",
  }).then(() => {
    fetch("http://localhost:3000/todos", {
      method: "GET",
    }).then((response) => {
      response.json().then((todos) => {
        setTodos(todos);
      });
    });
  });
}

function App() {
  function getTodos() {
    fetch("http://localhost:3000/todos", {
      method: "GET",
    }).then((response) => {
      response.json().then((todos) => {
        setTodos(todos);
      });
    });
  }

  const [todos, setTodos] = useState([]);

  // fetch all todos from server
  useState(() => {
    getTodos(setTodos);

    setInterval(() => {
      getTodos(setTodos);
    }, 1000);
  }, []);

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" />
        {todos.map((todo) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <Todo todo={todo} />
          );
        })}
      </div>
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return (
    <div>
      {props.todo.title}
      {props.todo.description}
      <button onClick={() => deleteTodo(props.todo.id)}>Delete</button>
    </div>
  );
}

export default App;
