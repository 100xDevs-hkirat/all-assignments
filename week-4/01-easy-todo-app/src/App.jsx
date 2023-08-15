import React, { useEffect, useState } from 'react';

function useTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();

   
    setInterval(fetchTodos, 1000);

 
  }, []);

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return { todos, deleteTodo };
}

function App() {
  const { todos, deleteTodo } = useTodos();

  return (
    <div id="mainArea">
      {todos.map((todo) => (
        <Todo key={todo.id} {...todo} deleteTodo={deleteTodo} />
      ))}
    </div>
  );
}

function Todo({ id, title, description, deleteTodo }) {
  const handleDelete = () => {
    deleteTodo(id);
  };

  return (
    <div>
      <span>{title}</span>
      <span> </span>
      <span>{description}</span>
      <span> </span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default App;
