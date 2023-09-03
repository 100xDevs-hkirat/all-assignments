import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import PropTypes from 'prop-types'
// import './TodoLi.jsx'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

    // fetch all todos from server
  useEffect(() => {
    axios.get('http://localhost:3000/todos').then((response) => {
      setTodos(response.data);
    });
    
  }, []);

  // delete a todo from server and update state
  function handleDeleteTodo(id) {
    axios.delete('http://localhost:3000/todos/' + id).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    }).catch(err => console.error("Error deleting todos:",err));
  }

  // add todo to server and update state
  function createTodo() {
    const data = { title, description };
    axios.post('http://localhost:3000/todos', data).then((res) => {
      data.id = res.data.id;
      setTodos([...todos, data]);
    }).catch(err => console.error("Error creating todo:", err));
  }

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        {/* get data in input and call createTodo */}
        <input type='text' placeholder='Title' onChange={e => setTitle(e.target.value)} />
        <input type='text' placeholder='Description' onChange={e => setDescription(e.target.value)} />
        <button onClick={() => createTodo()} > Add Todo </button>
        {
          todos.map(todo => {
            return <Todo key={todo.id} id={todo.id} title={todo.title} description={todo.description} onDelete={handleDeleteTodo}/>
          })
        }
      </div>
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    const { id, title, description, onDelete } = props;

    return <div>
        <span>{title}</span>
        <span>{description}</span>
        <button onClick={() => onDelete(id)}>Delete</button>
    </div>
}

Todo.propTypes = {
  id:PropTypes.number,
  title:PropTypes.string,
  description:PropTypes.string,
  onDelete:PropTypes.func
}

export default App
