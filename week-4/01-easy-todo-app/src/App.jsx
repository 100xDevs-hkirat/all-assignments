import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';


function App() {
    // fetch all todos from server
    const [todos, setTodos] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/todos").then((res) => {
      setTodos(res.data);
    })
  }, []);

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`).then(res => setTodos(res.data));
  }

  return (
    <>
      <div>
        <h1>Todo App</h1>
        <label>Enter a todo: </label>
        <input type="text" />
      </div>
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
    const {id, title } = todo;
    return (
      <li>
        <b>Title:</b> {title} <br />
        <button onClick={() => deleteTodo(id)}>Delete</button>
        <hr />
      </li>
    );
}

export default App
