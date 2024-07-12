import React, { useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Todo from "./todo";
import { Box, Button, Card, TextField, Typography } from "@mui/material";

function App() {
  const [todos, useTodos] = useState([]);
  const nameInput = useRef(null);
  const descriptionInput = useRef(null);

  // fetch all todos from server
  React.useEffect(() => {
    async function fetchData() {
      let res = await axios.get("http://localhost:3000/getAllTodos");
      useTodos(res.data);
    }
    fetchData();
  }, []);

  async function addTodo() {
    const nameValue = nameInput.current.value;
    const descriptionValue = descriptionInput.current.value;
    if (
      (nameValue && nameValue.length < 0) ||
      (descriptionValue && descriptionValue.length < 0)
    ) {
      /// TODO: here handle this
    } else {
      let resAdded = await axios.post("http://localhost:3000/addTodo", {
        name: nameValue,
        description: descriptionValue,
      });
      if (resAdded.status == 200) {
        const updatedTodos = [...todos, resAdded.data["data"]];
        useTodos(updatedTodos);
      }
    }
  }

  async function deleteAccount(TodoId) {
    let isTodoDel = await axios.post(
      "http://localhost:3000/deleteTodo/" + TodoId
    );

    if (isTodoDel.data["statusCode"] == 1) {
      let updatedTodo = todos.filter((ele) => {
        return ele.id != TodoId;
      });
      useTodos(updatedTodo);
    }
  }
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <Card
          sx={{
            maxWidth: 300,
            padding: 3,
            height: 200,
            paddingLeft: 16,
            marginLeft: 62,
          }}
          justifycontent={"center"}
        >
          <Typography>Add Todo</Typography>
          <TextField
            variant="outlined"
            label="Name"
            m={2}
            inputRef={nameInput}
          ></TextField>
          <Box
            justifycontent={"center"}
            display={"flex"}
            width={20}
            height={10}
          ></Box>
          <TextField
            variant="outlined"
            label="Description"
            m={2}
            inputRef={descriptionInput}
          ></TextField>
          <Box
            justifycontent={"center"}
            display={"flex"}
            width={20}
            height={10}
          ></Box>
          <Box justifycontent={"center"} display={"flex"}>
            <Button
              style={{ paddingRight: 82, paddingLeft: 82, marginLeft: 15 }}
              variant="contained"
              size="large"
              onClick={() => {
                addTodo();
              }}
            >
              Add
            </Button>
          </Box>
        </Card>
        {todos.map((todo) => {
          return (
            <Todo
              id={todo.id}
              deleteAccount={deleteAccount}
              name={todo.name}
              description={todo.description}
            ></Todo>
          );
        })}
      </div>
    </>
  );
}
export default App;
