import { useEffect, useState } from 'react'
import './App.css'

function useTodo() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    setInterval(() => {
      fetch("http://localhost:3000/todos", {
      method: 'GET' 
    }).then((response) => {
      response.json().then((data) => {
        console.log(data)
        setTodos(data);
      });
    });
    }, 1000)

  }, []);
  return todos;
  
}

function App() {
  
    // fetch all todos from server
    const todo = useTodo();

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" />
      </div>
      <div>
        {todo.map(todo => {
          return <Todo title = {todo.title} description = {todo.description}></Todo>
        })}
      </div>
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return <div>
        {props.title}
        {props.description}
    </div>
}

export default App
