import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
    // fetch all todos from server
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

const handleAddTodo = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTodo("");
      } else {
        console.error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

const handleDeleteTodo = async (index) => {
    try {
      const todoId = todos[index].id;

      const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos((prevTodos) => {
          const updatedTodos = [...prevTodos];
          updatedTodos.splice(index, 1);// Splice method is used to update, remove and delete elements in the array
          return updatedTodos;
        });
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text"
           value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          />
         <button onClick={handleAddTodo}>Add Todo</button>
      </div>
        {todos.map((todo, index) => {
        return (
          <Todo
            key={index}
            title={todo.title}
            onDelete={() => handleDeleteTodo(index)}
          />
        );
      })}
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return <div>
        {props.title}
      <button onClick={props.onDelete}>Delete</button>
    </div>
}

export default App
