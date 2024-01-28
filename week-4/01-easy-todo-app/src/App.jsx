import { useState, useEffect } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react';
import './App.css'


function getTodos(){
  let todos = [];
  React.useEffect(()=>{
    axios.get("http://localhost:3000/todos").then((res)=>{
      todos = res.data;
    })
  })
  return todos;
}
function deleteTodos(id){
  axios.delete("http://localhost:3000/todos"+"/"+id)
}
function createTodo(){
  axios.post("http://localhost:3000/todos",{
    title : "added from postButton",
    description : "wow added"
  })
}
function App() {
  var [todos, setTodos] = useState([])
  React.useEffect(()=>{
    axios.get("http://localhost:3000/todos").then((res)=>{
      setTodos(res.data);
    })
  })


  return (
    <>
    <button onClick={createTodo}>Add Todo</button>
    {todos.map((todo)=>(
        <div>
        <Todo title = {todo.title} description = {todo.description} id = {todo.id} deleteTodoFun = {()=> deleteTodos(todo.id)}></Todo>  
        </div>
    ),[])}
    </> 
    )

  
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return (<div>
        {props.title} {' '}
        {props.description}{' '}
        <button onClick={props.deleteTodoFun}>Delete</button>
    </div>)
}
export default App;


