import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function addTodo(todoInfo,setTodoLists) {
  if (!todoInfo) return;
  axios.post('http://localhost:3000/todos',{
    title : todoInfo.title,
    description : todoInfo.description
  })
    .then(response => {
      console.log("Todo Added")
      getTodo(setTodoLists);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function deleteTodo(todoId,setTodo) {
  if (!todoId) return;
  axios.delete('http://localhost:3000/todos/' + todoId)
    .then(response => {
      console.log("Todo delete")
      getTodo(setTodo);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function getTodo(setTodoFn){
  axios.get('http://localhost:3000/todos')
      .then(response => {
        setTodoFn(response.data);
        console.log("Todo Fetched")
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function App() {
  const [todos, setTodos] = useState({title : "" , description : ""})
  const [todoList , setTodoLists] = useState([])
    // fetch all todos from server
  console.log(todos);
  useEffect(()=>{
    const timeout = setInterval(()=>{
      getTodo(setTodoLists);
    },5000)
    return () => clearInterval(timeout);
  },[]);
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        Title
        <input type="text" onChange={e => setTodos({
          title : e.target.value,
          description : todos.description || null
        })}/>
        Description
        <input type="text" onChange={e => setTodos({
          title : todos.title || null,
          description : e.target.value
        })}/>
        <button onClick={() => addTodo(todos,setTodoLists)}>Submit</button>
        {todoList.map((todo) => {
          return <Todo title={todo.title} description ={todo.description} id ={todo.id} setTodo = {setTodoLists}></Todo>
        })}
      </div>
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return <div>
      <br/>
      id : {props.id}
      <br/>
      title : {props.title}
      <br/>
      description : {props.description}
      <br/>
      <button onClick={() => {deleteTodo(props.id,props.setTodo)}}>Delete</button>
    </div>
}

export default App
