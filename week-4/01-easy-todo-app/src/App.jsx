import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [count, setCount] = useState(0)

  // fetch all todos from server
  useEffect(() => {
    axios.get(`http://localhost:3000/todos/`).then((res) => {
      setTodos(res.data);
    });
  }, [count]);

  const handleDelete = (id) => {
      axios.delete(`http://localhost:3000/todos/${id}`)
      .then(function (response) {
        console.log(response);
        setCount((prevCount) => prevCount + 1);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  let listTodos = todos.map((todo) => (
    <Todo 
      key={todo.id}
      id={todo.id}
      title={todo.title}
      onDelete={() => handleDelete(todo.id)}
    ></Todo>
  ));

  const handleCreateItem = () => {
    console.log(title + " " + description);
    if(title && description) {
      axios.post(`http://localhost:3000/todos`, {
        title,
        description
      })
      .then(function (response) {
        console.log(response);
        setCount((prevCount) => prevCount + 1);
      })
      .catch(function (error) {
        console.log(error);
      });
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#eeeeee",
          padding: "20px",
          textAlign: "center",
          marginLeft: "25vw",
          marginRight: "25vw",
          marginTop: "25vh"
        }}
      >
        <h1>Easy Todo App</h1>
        <div>
          <input
            id="title"
            type="text"
            placeholder="Enter the title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
          <br />
          <input
            id="description"
            type="text"
            placeholder="Enter the description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></input>
          <br />
          <br />
          <button
            onClick={handleCreateItem}
          >
            Create Item
          </button>
        </div>

        <h3>Your todo list</h3>
        <div
          style={{
            display: "inline-block",
            textAlign: "left",
          }}
        >
          <ul>{listTodos}</ul>
        </div>
      </div>
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "30vw",
      }}
    >
      <div>{props.id}</div>
      <div>{props.title}</div>
      <button
        onClick={props.onDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default App;
