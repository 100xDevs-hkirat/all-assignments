import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server

  const fetchUserData = () => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const deleteTodo = (id) => {
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting todo");
        }
      })
      .catch((error) => {
        console.error("Error while deleting todo:", id);
      });
  };

  const addTodo = () => {
    const title = document.getElementById("titleInput").value;
    const description = document.getElementById("descriptionInput").value;

    console.log(title);
    console.log(description);

    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
        document.getElementById("titleInput").value = "";
        document.getElementById("descriptionInput").value = "";
      })
      .catch((error) => {
        console.error("Error while deleting todo:", id);
      });
  };

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input id="titleInput" type="text" placeholder="Title" />
        <br />
        <input id="descriptionInput" type="text" placeholder="Description" />
        <br />
        <button onClick={addTodo}>+ Add</button>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            title={todo.title}
            description={todo.description}
            deleteTodo={deleteTodo}
            id={todo.id}
          />
        ))}
      </div>
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  const handleDelete = () => {
    props.deleteTodo(props.id);
  };
  return (
    <div>
      <ul>
        <li>
          <h3>{props.title}</h3>
          <p>{props.description}</p>
          <button onClick={handleDelete}>Delete</button>
        </li>
      </ul>
    </div>
  );
}

export default App;
