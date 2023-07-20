import React, { useState } from "react";

export default function AddTodo({ setTodos, todos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTodoHandler = () => {
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Todo Added successfully!");
          setDescription("");
          setTitle("");
          return response.json();
        } else {
          console.log("Failed to add Todo");
        }
      })
      .then((data) => {
        setTodos([...todos, data]);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };
  const inputStyle = {
    display: "block",
    marginBottom: "10px",
    width: "300px",
    height: "20px",
  };
  return (
    <>
      <h1 style={{ color: "yellow" }}>Add Todo</h1>
      <input
        type="text"
        placeholder="Title"
        style={inputStyle}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        style={inputStyle}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTodoHandler}>Add Todo</button>
    </>
  );
}
