import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todoForToday, setTodoForToday] = useState([{
    title: "Wake up",
    description: "Wake up at 8"
  }, {
    title: "Wake down",
    description: "Wake up at 12"
  }])
  
  useEffect(() => {
    setInterval(() => {
      setTodoForToday([{
        title: "Wake up",
        description: "Wake up at " + Math.random()
      }])
    }, 2000)
  }, [])

  return (
    <div>
      {todoForToday.map((todo) => {
        return <Todo title={todo.title} description={todo.description} />
      })}
    </div>
  )
}


function Todo(props) {
  return <div>
    {props.title}
    <br />
    {props.description}
    <br />
  </div>
}

export default App
