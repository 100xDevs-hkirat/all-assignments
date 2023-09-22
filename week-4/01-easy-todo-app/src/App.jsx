import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';


// function Todo(props) {
//     // Add a delete button here so user can delete a TODO.
//     return <div>
//         {props.title}
//     </div>
// }
import './App.css'
import React from "react";
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
    // fetch all todos from server

    React.useEffect(() => {

      axios.get('http://localhost:3001/todos').then((res) => {
      const todosFromServer = res.data.Todos;
      console.log('todos' + todosFromServer);
      setTodos(todosFromServer);
    });

    }, [])

    if(!todos)
      return null;

    const removeItem = (id) => {
      axios.delete(`http://localhost:3001/todos/${id}`).then((res) => {
        console.log("yahaaa" + res.data);
      });
    }

    const addItem = () => {
      axios.post('http://localhost:3001/todos', { title, description }).then(() => {
        console.log("hereee");
        setTitle('');
        setDescription('');
      });
    }

  return (
    <>
      <center style={{marginTop: 200}}>
       <Card style={{width: 400}}>
        <h1>Easy Todo App</h1>
        <TextField value={title} size='small' onChange={(e) => {setTitle(e.target.value)}} 
        id="standard-basic" label="Title" variant="standard" />

        <TextField value={description} size='small'  onChange={(e) => {setDescription(e.target.value)}} id="standard-basic" label="Description" variant="standard" />

        <Button variant="outlined" style={{fontSize:'10px', margin:'12px', padding:'5px' }} onClick={addItem}>Submit</Button>

        {todos.map((todo) => {
          return (
          <div key={todo._id}>
            <div>{todo.title}</div>
            <div>{todo.description}</div>
            <Button variant="outlined" style={{fontSize:'10px', margin:'12px', padding:'5px' }} onClick={() => removeItem(todo._id)}>Delete</Button>
          </div>
        );
        })}

        </Card>
      </center>
    </>
  )
}
export default App
