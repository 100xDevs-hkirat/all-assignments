import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




function App() {

  const [todos, setTodo] = useState([{
    id: "hhuihuhuiiu004994",
    title: "Go to gym",
    description: "Gym karo, bode banao, khush raho"
  },
  {
    id: ",jfgtrhrhhyyhhr",
    title: "Eat Food",
    description: "Gym karo, bode banao, khush raho"
  },
  {
    id: "mmjjmjmjjj",
    title: "thnrr",
    description: "Gym karo, bode banao, khush raho"
  }])
  return (
    <>
      {todos.map(todo => {
        return (
          <Todo title = {todo.title} description = {todo.description}></Todo>
        )
      })}
    </>
  )
}

function Todo(props) {
  return (
    <div style={{backgroundColor: "blue"}}>
      {props.title}
      <br></br>
      {props.description}
      <br></br>
      <br></br>
    </div>
  )
}

export default App
