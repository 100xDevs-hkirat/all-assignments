import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [todos, setTodos] = useState(['Morning Walk']);
  // fetch all todos from server
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
        <div>
          <p>{todo}</p>
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
