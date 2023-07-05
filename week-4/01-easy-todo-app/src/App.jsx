import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/todos')
      .then((res) => res.json())
      .then((result) => setTodos(result));
  }, []);

  const addTodo = () => {
    console.log('Add clicked' + todo);
    fetch('http://localhost:4000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo,
        description: todo,
      }),
    })
      .then((res) => res.json())
      .then((result) => console.log(result));
  };

  const removeTodo = (id) => {
    console.log('Remove clicked');
    fetch(`http://localhost:4000/todos/${id}`, {
      method: 'DELETE',
    }).then((res) => console.log(res));
  };

  const handleInputChange = (event) => {
    setTodo(event.target.value);
  };
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type='text' onChange={handleInputChange} />
        <button onClick={addTodo} disabled={todo === ''}>
          Add
        </button>
      </div>
      {todos.map((todo) => (
        <div style={{ display: 'flex', alignItems: 'center' }} key={todo.id}>
          <div>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
          </div>
          <button onClick={() => removeTodo(todo.id)}>x</button>
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
