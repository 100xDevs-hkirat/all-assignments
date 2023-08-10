import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // fetch("http://localhost:3000/todos/", {
    //   method: "GET",
    // }).then((res) => res.json().then((data) => setTodos(data)));
    axios.get("http://localhost:3000/todos").then((res) => {
      setTodos(res.data);
    });
  }, [todos]);

  function handleClick() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    try {
      fetch("http://localhost:3000/todos/", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    } catch (err) {
      console.log("There was an error", err);
    }
  }

  return (
    <>
      <h1>Easy Todo App</h1>
      <br />
      {/* Create TODO */}
      <input type="text" id="title" placeholder="Title" />
      <input type="text" id="description" placeholder="Description" />
      <button onClick={() => handleClick()}> Submit Todo </button>

      {/* Display TODO */}
      {todos.map((item) => {
        return (
          <CreateTodo
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
          />
        );
      })}
    </>
  );
}

function handleDelete(id) {
  try {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log("There was an error", err);
  }
}

//Create a todo component
function CreateTodo(props) {
  // eslint-disable-next-line react/prop-types
  const { id, title, description } = props;
  return (
    <div>
      <span>{title}</span>
      <br />
      <span>{description}</span>
      <br />
      <button onClick={() => handleDelete(id)}>Delete</button>
    </div>
  );
}

CreateTodo.prototype = {
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default App;
