import { useState, useEffect } from 'react'
import './App.css'



function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // fetch all todos from server
  const fetchTodo = async () => {
    await fetch("http://localhost:3000/todos", {
      method: "GET"
    }).then(res => res.json())
      .then(res => setTodos(res))
      .catch(err => console.log(err))
  }

  // delete a todo with specific id
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE"
    })
    fetchTodo();
  }
  //add new todo 
  const addTodo = async (e) => {
    e.preventDefault(e)
    var newTodo = { title: title, description: description }
    console.log(newTodo)
    await fetch(`http://localhost:3000/todos/`, {
      method: "POST", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTodo)
    })
    setDescription('')
    setTitle('')
    fetchTodo();
  }


  useEffect(() => {
    fetchTodo();
  }, [])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Easy Todo App</h1>
        <form onSubmit={addTodo} className="">
          <label htmlFor="title">title</label>
          <input type="text" name="title" id="title" value={title}
            onChange={(e) => setTitle(e.target.value)} />
          <br />
          <br />

          <label htmlFor="description">description</label>
          <input type="text" name="description" id="description" value={description}
            onChange={(e) => setDescription(e.target.value)} />
          <br />
          <br />

          <button onClick={addTodo} >ADD TODO</button>
        </form>


        <div className="">
          {todos.map(todo => {
            return <Todo key={todo.id} id={todo.id} title={todo.title} description={todo.description} deleteTodo={deleteTodo} />
          })}
        </div>
      </div>
    </>
  )
}

function Todo({ title, description, id, deleteTodo }) {
  // Add a delete button here so user can delete a TODO.

  return <div>
    {title} {description} <button onClick={() => { deleteTodo(id) }}>delete</button>
    <br />
  </div>
}

export default App
