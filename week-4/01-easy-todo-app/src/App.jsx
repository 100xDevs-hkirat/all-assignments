import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Create from './components/create'
import Todolist from './components/alltodo'
// import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';


function App() {
  const [todos, setTodos] = useState([])
    // fetch all todos from server

  return (
    <>
      <Create/>
      <br/>
      <br/>
      <Todolist/>
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
