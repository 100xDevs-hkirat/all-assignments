import React, { useState } from "react";

export default function AddTodo({ setTodos, todos, client }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTodoHandler = () => {
    client
      .post("/todos", { title, description })
      .then((response) => {
        setDescription("");
        setTitle("");
        setTodos([...todos, response.data]);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <h1 style={{ color: "yellow" }}>Add Todo</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTodoHandler}>Add Todo</button>
    </>
  );
}
