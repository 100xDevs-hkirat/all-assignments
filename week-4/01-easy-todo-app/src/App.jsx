import axios from "axios";
import React from "react";
import { useState, useEffect } from 'react'
import './App.css'
import Todo from './assets/componants/todo'



function App() {
  const [todos, setTodos] = useState({
    "title": "",
    "descreption": "",
    "compleated": false
  })
  const [allTodos, setAllTodos] = useState([])

  const client = axios.create({
    baseURL: "http://localhost:3000/todos"
  });


  useEffect(() => {
    setInterval(() => {
      client.get().then((response) => {
        setAllTodos(response.data);
      });
    }, 1000)
  }, [])

  function handleChange(e) {
    const { type, checked, name, value } = e.target
    setTodos((prev) => {
      return {
        ...prev,
        [name]: type === checked ? checked : value
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (todos.title.length === 0 || todos.descreption.length === 0) {
      alert("title or discreption is empty")
      return;
    }
    const body = {
      title: todos.title,
      compleated: false,
      description: todos.descreption
    }
    client.post("", body).then()
  }

  function remove(id) {
    client.delete(`${id}`)
  }

  return (
    <>
      <div className="container">
        <h1>Add Todo</h1>
        <h3>Todo Title</h3>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={todos.title}
        />
        <h3>Todo description</h3>
        <input
          type="text"
          name="descreption"
          onChange={handleChange}
          value={todos.descreption}
        />
        <button onClick={handleSubmit} className="input">submit</button>


        <h1>Task To Be Done</h1>
        <div className="todo--container">
          {allTodos.map(ele => <Todo todoItem={ele} remove={remove} />)}
        </div>
      </div>
    </>
  )
}

export default App
