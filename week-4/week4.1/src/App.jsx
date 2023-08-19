import { useEffect, useState } from 'react'

import './App.css' 
import Todo from './components/Todo'

function App() {


  const [todos,setTodos]= useState([]);



  useEffect(()=>{
    fetch("http://localhost:3000/todos",{
      method:"GET"
    }).then((resp)=>{
      resp.json().then((data)=>{
        console.log(data)
        setTodos(data)
      })
  })
  },[])
  
  return (
    <>
        <div>
          Title
          <input type="text" name="title" id="" />
          Description
          <input type="text" name="description" id="" />
          <button >Add Todo</button>
        </div>
        

        <Todo todos={todos} />

    </>
  )
}

export default App
