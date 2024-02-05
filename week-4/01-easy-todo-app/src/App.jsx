import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
    // fetch all todos from server
    React.useEffect(() => {
      fetch('http://localhost:3000', {
        method: 'GET'
      }).then((response) => {
        response.json().then((todo) => {
          setTodos(todo);
        })
      })
      
      setInterval(() => {
        fetch('http://localhost:3000', {
        method: 'GET'
      }).then((response) => {
        response.json().then((todo) => {
          setTodos(todo);
        })
      })  
      }, 1000)

    }, []);

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" />
        {todos.map((value) => {
          return <>
          <span>{value.title}</span>
          <span>{value.description}</span>
          <button>DELETE</button>
          <br></br>
          </>
        })}
      </div>
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return <div>
        {props.title}
    </div>
}

export default App
