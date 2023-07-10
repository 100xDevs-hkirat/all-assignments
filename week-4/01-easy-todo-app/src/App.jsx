import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from "react";

function createToDOs(){
fetch('http://localhost:3000/todos', {
  method: 'POST',
  body: JSON.stringify({
    title: "tittle",
    description:"desc"
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  }
}).then((response) => {
  response.json().then((data) => {
    console.log(data);
    useTodos();
  })
});
}

function useTodos() {
  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/todos", {
      method: "GET"
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        setTodos(data);
      })
    });
  }, []);

  return todos;
}

function App() {
  const todos = useTodos();
  
    // fetch all todos from server

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" />
      </div>
      <Todo todos={todos}></Todo>
      <CREATETODO></CREATETODO>
    </>
  )
}
// return <DummyComponent name="Tooba" a={5} b={2}></DummyComponent>

function Todo(props) {
    const todos = props.todos;
    // Add a delete button here so user can delete a TODO.
    return (<div>
    {todos.map(todo=>{
        return <div>
            {todo.title}
            <button id={todo.id}>Delete</button>
            <br/>
        </div>
        })}
    </div>)
}

function CREATETODO(){
  return(<div>
    <form onSubmit={createToDOs()}>
    <label>Title:</label><br/>
    <input type="text" id="title" value="title"></input><br/>  
    <label>Description:</label><br/>
    <input type="text" id="description" value="description"/><br/><br/>
    <button type="submit">Submit</button>
    </form>
  </div>)
}

export default App
