import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function useTodos() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server
  React.useEffect(() => {
    fetch("http://localhost:3000/todos", {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return todos;
}

function ListallTodos() {
  const todos = useTodos();
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <div>{todo.title}</div>
          <div>{todo.description}</div>
          <br />
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <ListallTodos></ListallTodos>
    </div>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>{props.title}</div>;
}

export default App;
