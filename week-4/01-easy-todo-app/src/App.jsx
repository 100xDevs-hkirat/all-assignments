import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';


function App() {
    // fetch all todos from server
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
      setInterval(() => {
        axios.get("http://localhost:3000/todos").then((res) => {
        setTodos(res.data);
      })
    }, 10000); 
  }, []);

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`).then(res => setTodos(res.data));
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {title, description};

    axios.post('http://localhost:3000/todos', formData, {headers: {'Content-Type': 'application/json'}})
    .then(res => console.log('Response Server: ', res.data));

    setTitle('');
    setDescription('');
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Title: <input type="text" value={title} onChange={handleTitleChange} /> </label>
        <br />
        <label>Description: <input type="text" value={description} onChange={handleDescriptionChange} /> </label>
        <br />
        <button type='submit'>Enter</button>
      </form>
      <ol>
        {todos.map(todo => (
          <ShowTodo key={todo.id} todo={todo} deleteTodo={deleteTodo}/>
        ))}
      </ol>
    </>
  )
}

function ShowTodo({ todo, deleteTodo}) {
    // Add a delete button here so user can delete a TODO.
    const {id, title, description } = todo;
    return (
      <li>
        <b>Title:</b> {title} <br />
        <b>Description:</b> {description} <br />
        <button onClick={() => deleteTodo(id)}>Delete</button>
        <hr />
      </li>
    );
}

export default App
