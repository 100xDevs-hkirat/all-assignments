import { useState, useEffect } from "react";

function ListallTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/todos", {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setTodos(data);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    });
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.description}</span>
          <button onClick={() => handleDelete(todo.id)}>delete</button>
        </div>
      ))}
    </div>
  );
}

export default ListallTodos;
