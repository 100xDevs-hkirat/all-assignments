import { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/todos', {
        title,
        description,
      });
      setTodos((prevTodos) => [...prevTodos, response.data]);
      console.log(response.data);
      // Handle the response from the server as needed
    } catch (error) {
      console.error(error);
      // Handle any error that occurred during the request
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/todos/${id}`);
  };

  const toggleTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      console.log(response.data);
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>
        <span>Todo title</span>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div>
        <span>Todo description</span>
        <input
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>
      <button onClick={handleSubmit}>send todo</button>
      <button onClick={toggleTodos}>Toggle todos</button>
      <div>
        {todos.map((el) => (
          <div key={el.id}>
            <p>
              <button onClick={() => handleDelete(el.id)}>❌</button>{' '}
              <span>
                Title: {el.title}
                <br />
                Description: {el.description}{' '}
              </span>
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
