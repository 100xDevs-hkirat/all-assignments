import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./App.css";
import { Typography } from "@mui/material";

import Todo from "./Todo";

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
  const fetchData = () => {
    fetch("http://localhost:3003/todos", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.log(error));
  };
  useEffect(fetchData, []);

  return (
    <>
      <div>
        <Typography>Easy Todo App</Typography>
        <Todo todos={todos} fetchData={fetchData} />
      </div>
    </>
  );
}

export default App;
