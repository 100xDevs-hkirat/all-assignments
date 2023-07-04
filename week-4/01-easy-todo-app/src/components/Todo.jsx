import { useEffect, useState } from "react";
import "./TodoApp.css";
import axios from "axios";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/todos");
      setTodos(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:4000/todos", {
          title: inputValue,
          description: "",
        });
        setTodos([...todos, response.data]);
        setInputValue("");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteTodo = async (index) => {
    const todoId = todos[index].id;
    try {
      await axios.delete(`http://localhost:4000/todos/${todoId}`);
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Enter a todo..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index}>
            <span>{todo.title}</span>
            <button onClick={() => handleDeleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
