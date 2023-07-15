import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef();
  // fetch all todos from server
  const fetchTodo = () => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  };
  useEffect(() => {
    fetchTodo();
  }, []);

  const handleAdd = () => {
    const todo = inputRef.current.value;
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo, description: todo }),
    }).then((res) => {
      alert("todo added successfully!!!");
      inputRef.current.value = "";
      fetchTodo();
    });
  };
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" ref={inputRef} />{" "}
        <button onClick={() => handleAdd()}>add</button>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} fetchTodo={fetchTodo} />
        ))}
      </div>
    </>
  );
}

function Todo({ todo, fetchTodo }) {
  const handleDelete = (id) => {
    console.log(id);
    fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" }).then(
      () => {
        fetchTodo();
      }
    );
  };
  // Add a delete button here so user can delete a TODO.
  return (
    <div>
      {todo.title}. {todo.description}{" "}
      <button onClick={() => handleDelete(todo.id)}>delete</button>
    </div>
  );
}

export default App;
