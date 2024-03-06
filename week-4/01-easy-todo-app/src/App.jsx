import { useState } from 'react'
import { useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  // fetch all todos from server

  const getAllTodos = async () => {
     const response = await fetch("http://localhost:3000/todos", {
        method: "GET"
     });
     const data = await response.json();
     setTodos(data);
     console.log(data);
  }

  console.log("Hi, wejlwje");
  const title = useRef(null)
  const description = useRef(null)
  
  function addOnClick() {
     fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
          title: title.current.value,
          description: description.current.value
        }),
        headers : {
          "Content-Type": "application/json"
        }
     }).then(getAllTodos);
  }

  const doneOnClick = (id) => {
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
      headers : {
        "Content-Type": "application/json"
      }
    }).then(getAllTodos);
 }
  
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <p style = {{display: 'inline', marginRight : '50px'}}>Title   </p>
        <input 
            type="text"
            ref={title} 
        />
        <br></br>
        <p style = {{display: 'inline', marginRight : '5px'}}>Description </p>
        <input 
            type="text"
            ref={description} 
        />
        <button onClick = {addOnClick} style={{ 
           marginLeft : "8px"
         }}>Add</button>
         <h3>To-do items</h3>
         {todos.map(todo => {
           return <div>
              {todo.title}
              &nbsp;
              {todo.description}
              <button onClick={doneOnClick.bind(null, todo.id)}>Done</button>
           </div>
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
