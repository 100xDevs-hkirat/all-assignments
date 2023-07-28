import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import "./App.css";

function Header() {
  return (
    <header>
      <h1>Note taking app</h1>
    </header>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState();
  const [updateTodo, setUpdateTodo] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [isUpdated, setIsUpdated] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, [todos]);

  function handleChange(event) {
    setTodo(event.target.value);
  }

  function addTodo() {
    const newTodo = {
      title: todo,
      description: "",
    };
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => console.log("Todo added"));

    setTodo("");
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Deleted Todo");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function updateTheTodo(id) {
    const newTodo = {
      title: updateTodo,
      description: "",
    };
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Deleted Todo");
      })
      .catch((error) => {
        console.error(error);
      });

    setUpdateTodo("");
    setIsUpdated("");
  }

  return (
    <>
      <Header />
      <div className="container">
        <TextField
          id="outlined-basic"
          label="Todo"
          variant="outlined"
          onChange={handleChange}
          value={todo}
        />
        <Button variant="contained" onClick={addTodo}>
          Add
        </Button>
      </div>

      {todos.map((todo) => {
        return todo._id === isUpdated ? (
          <div className="update-form">
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder={todo.title}
              onChange={(event) => {
                setUpdateTodo(event.target.value);
              }}
            />
            <Button variant="contained" onClick={() => updateTheTodo(todo._id)}>
              Update
            </Button>
          </div>
        ) : (
          <div className="todo-container" key={todo.id}>
            <div style={{ display: "flex" }}>
              <Checkbox
                // checked={checked}
                onChange={() => {}}
                inputProps={{ "aria-label": "controlled" }}
              />
              <p style={{ textDecoration: isChecked && "line-through" }}>
                {todo.title}
              </p>
            </div>
            <div>
              <Button variant="text" onClick={() => setIsUpdated(todo._id)}>
                Update
              </Button>
              <Button variant="text" onClick={() => deleteTodo(todo._id)}>
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default App;
