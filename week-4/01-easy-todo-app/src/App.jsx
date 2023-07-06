import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // fetch all todos from server
  const fetchData = async () => {
    try {

      const data = await fetch("http://localhost:3000/todos");
      const jsonData = await data.json();

      setTodos(jsonData)

    } catch (error) {
      console.error(error)
    }
  }
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }
  const HandleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const HandleSubmit = async () => {
    const todoDoc = {
      title: title,
      description: description
    };
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoDoc)
      })
      const responseData = await response.json();
    }
    catch (error) {
      console.error(error)
    }
  }
  async function deleteTodo(id) {
    const dlttd = await fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

  }
  fetchData()



  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        Title:<input type="text" onChange={handleTitleChange} />
        <br />
        <br />
        Description:<input type="text" onChange={HandleDescriptionChange} />
        <br />
        <br />
        <button type='submit' onClick={HandleSubmit}>Add Todo</button>
      </div>
      <div>
        {todos.map((value) => {
          return (

            <span key={value.id}>

              <h3>{value.title}</h3>
              <h3>{value.description}</h3>
              <button onClick={() => {
                deleteTodo(value.id)
              }} >Delete</button>
            </span>
          )

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
