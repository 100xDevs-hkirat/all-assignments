import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./App.css";
import { Typography } from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server
  /*  fetch("http://localhost:3003/todos", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      response.json();
    })
    .catch((err) => console.log(err))
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}; */
  useEffect(() => {
    fetch("http://localhost:3003/todos", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div>
        <Typography>Easy Todo App</Typography>
        <Todo todos={todos} />
      </div>
    </>
  );
}

function Todo({ todos }) {
  // Add a delete button here so user can delete a TODO.
  const deleteTodo = (e) => {
    console.log(e.target.id);
    fetch("http://localhost:3003/todos/1", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="table">
        <div className="row">
          <div className="cell">
            <Typography>Title</Typography>
          </div>
          <div className="cell">
            <Typography>Description</Typography>
          </div>
          <div className="cell">
            <Typography>Completed</Typography>
          </div>
          <div className="cell"></div>
        </div>

        <div></div>

        {todos.map((todo) => (
          <React.Fragment key={todo.id}>
            <div className="row">
              <div className="cell">
                <input disabled value={todo.title} />
              </div>
              <div className="cell">
                <input disabled value={todo.description} />
              </div>
              <div className="cell">
                <input disabled value={String(todo.completed)} />
              </div>
              <div className="cell">
                <Button id={todo.id} onClick={deleteTodo}>
                  Delete
                </Button>
              </div>
            </div>
          </React.Fragment>
        ))}
        <div className="row">
          <div className="cell col-span-1"><Button>Add Todo</Button></div>
        </div>
      </div>
    </>
  );
}

export default App;
