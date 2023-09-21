import { useEffect, useState } from 'react'
import './App.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
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
        <TextField label='Title' size='small' variant='standard' type="text" value={title} onChange={handleTitleChange} />
        <br />
        <TextField label='Description' variant='standard' type="text" value={description} onChange={handleDescriptionChange} />
        <br /> <br />
        <Button variant='contained' type='submit'>Enter</Button>
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
        <Typography>{title}</Typography>
        <Typography>{description}</Typography>
        <Button variant='contained' color='error' onClick={() => deleteTodo(id)}>Delete</Button>
        <hr />
      </li>
    );
}

export default App
