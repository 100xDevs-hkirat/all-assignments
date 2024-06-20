import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function createtodo(){
  const title=document.getElementById("title").value
  const description=document.getElementById("description").value
  let newTodo={
    title:title,
    description:description
  }
  newTodo['id']=new Date().getTime()
  return newTodo;

}

function App() {
  const [todos, setTodos] = useState([])
  setTimeout(()=>{
    const elements = document.getElementsByTagName('b');

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.color = 'red';
    }
  },1)
   

  const handleTodoSubmit = () => {
    let newTodo = createtodo();
    fetch("http://localhost:3000/todos",{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
              title:newTodo.title,
              description:newTodo.description,
              id:newTodo.id
      })
    })
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };


  const handleDeletion=(id)=>{
    fetch("http://localhost:3000/todos/"+id,{
      method:"DELETE"
    })
    setTodos((prevTodos)=>prevTodos.filter((todo)=>todo.id!=id))
  }



  let readTodosFromFile=()=>{
    fetch("http://localhost:3000/todos").then((response)=>response.json()).then((data)=>setTodos(data)).then(()=>{ 
      
      
    }) 
       }
    
   useEffect(()=>{
      readTodosFromFile()
   },[])
  
  
    // fetch all todos from server

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        Title:<input type="text" id="title" placeholder='title of todo'/>
        <br/><br/>
        Description:<input type="text" id="description" placeholder='description'/>
        <br/><br/>
        <button onClick={handleTodoSubmit}>submit</button>
        
      </div>
      {todos.map((todo)=>{

        return(
             <>
          <Todo key={todo.id} title={todo.title} description={todo.description} id={todo.id} delete={handleDeletion}></Todo>
          
           </>
          )
           })}
    </>
  )
  
}




function Todo(props) {
  let deleteTodo=()=>{
    props.delete(props.id)
  }
    // Add a delete button here so user can delete a TODO.

    return <div id="todo">
       <b>Title</b>:{"  "+props.title+"     "}<b>Description</b>:{"   "+props.description+"    "}
        <button onClick={deleteTodo}>Delete</button>
    </div>
   
}

export default App
