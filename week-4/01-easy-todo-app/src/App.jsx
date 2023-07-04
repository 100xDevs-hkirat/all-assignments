import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/todos')
      .then((res) => res.json())
      .then((result) => setTodos(result));
  }, []);

  const addTodo = () => {
    console.log('Add clicked');
  };

  const removeTodo = () => {
    console.log('Remove clicked');
  };
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type='text' />
        <button onClick={addTodo}>Add</button>
      </div>
      {todos.map((todo) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
          </div>
          <button onClick={removeTodo}>x</button>
        </div>
      ))}
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>{props.title}</div>;
}

export default App;
