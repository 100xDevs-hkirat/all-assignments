import { useState } from 'react'
import './App.css'

function useTodo() {
  const [todos, setTodos] = useState([])

}

function App() {
  
    // fetch all todos from server

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" />
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
