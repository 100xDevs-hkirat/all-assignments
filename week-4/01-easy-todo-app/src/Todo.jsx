import React, { useState, useEffect } from "react";
import TodoInput from "./TodoInput";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Todo({ todos, fetchData }) {
  // Add a delete button here so user can delete a TODO.
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editEnabled, setEnabledEdit] = useState(false);
  const handleOpenPrompt = () => {
    console.log(isPromptOpen);
    setIsPromptOpen(true);
  };

  const handleClosePrompt = () => {
    //console.log(isPromptOpen);
    setTitle("");
    setDescription("");
    setIsPromptOpen(false);
    //console.log(isPromptOpen);
  };

  const handlePromptSubmit = (inputValue) => {
    console.log(JSON.stringify(inputValue));
    inputValue.completed = "false";
    fetch("http://localhost:3003/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(inputValue), // Convert the JSON object to a string and set it as the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response body as JSON
      })
      .then((responseData) => {
        // Handle the response data here
        console.log("Response Data:", responseData);
        fetchData();
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        console.error("Error:", error);
      });
    setIsPromptOpen(false);
  };

  const deleteTodo = (todo) => {
    console.log(JSON.stringify(todo));
    //alert(e.target.id);
    fetch("http://localhost:3003/todos/" + todo._id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        setTitle("");
        setDescription("");
        fetchData();
      })
      .catch((error) => console.log(error));
  };

  const editTodo =()=>{
    setEnabledEdit(!editEnabled)
  }

  return (
    <>
      <div className="table">
        <div className="row">
          <div className="cell col-span-1">
            <button className="custom-button" onClick={handleOpenPrompt}>
              Add Todo
            </button>
            <TodoInput
              isPromptOpen={isPromptOpen}
              onClose={handleClosePrompt}
              onSubmit={handlePromptSubmit}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
          </div>
        </div>
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
          <React.Fragment key={todo._id}>
            <div className="row">
              <div className="cell">
                <input disabled={!editEnabled} value={todo.title} />
              </div>
              <div className="cell">
                <input disabled={!editEnabled} value={todo.description} />
              </div>
              <div className="cell">
                <span clasname={`${editEnabled ? "hideCompleted" : ""}`}>
                  <input
                    disabled={!editEnabled}
                    value={String(todo.completed)}
                  />
                </span>
                <span clasname={`${editEnabled ? "" : "hideCompleted"}`}>
                  <input type="checkbox" value={String(todo.completed)} />
                </span>
              </div>
              <div className="cell">
                <Button onClick={() => deleteTodo(todo)}>Delete</Button>
              </div>
              <div className="cell">
                <Button onClick={() => editTodo(todo)}>
                  {editEnabled ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default Todo;
