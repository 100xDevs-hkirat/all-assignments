import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




function App() {

  const [todo, setTodo] = useState({
    id:"hhuihuhuiiu004994",
    title: "Go to gym",
    description: "Gym karo, bode banao, khush raho"
  })
  setInterval(()=>{
    setTodo(({
      id:"hhuihuhuiiu004994",
      title: "Eat food",
      description: "Acha khaana khao"
    }))
  },3000);

  return (
    <>
      <h1>Todo App</h1>
      <UserName todoTitle = {todo.title} todoDescription = {todo.description}></UserName>
    </>
  )
}

function UserName(props){
  return (
    <>
    <div>
      {props.todoTitle}<br></br>{props.todoDescription}
    </div>
    </>
  )
}

export default App
