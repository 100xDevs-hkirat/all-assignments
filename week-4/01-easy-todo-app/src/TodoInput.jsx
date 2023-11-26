import React, { useState, useEffect } from "react";
import "./TodoInput.css";
import Button from "@mui/material/Button";

function TodoInput({
  isPromptOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any input validation if required

    // Call the onSubmit function with the input values
    onSubmit({ title, description });

    // Close the modal after submission
    onClose();
  };

  return (
    <div className={`todoinput ${isPromptOpen ? "open" : ""}`}>
      <div className="todoinput-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Todo</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="custom-button" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default TodoInput;
