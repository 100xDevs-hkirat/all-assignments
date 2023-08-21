/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

function App() {
  const [todos, setTodos] = useState([])
  const [todoDetail, setTodoDetail] = useState({
    title: '',
    description: '',
  })

  const [selectedId, setSelectedId] = useState('')

  // fetch all todos from server

  const fetchTodos = async () => {
    const { data: todos } = await axios.get(`${BASE_URL}/todos`)

    setTodos(todos)
  }

  const resetTodo = () => {
    setTodoDetail({
      description: '',
      title: '',
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { description, title } = todoDetail

    if (selectedId) {
      await axios.put(`${BASE_URL}/todos/${selectedId}`, {
        title: todoDetail.title,
        description: todoDetail.description,
      })
    } else {
      await axios.post(`${BASE_URL}/todos`, {
        title,
        description,
      })
    }

    resetTodo()

    fetchTodos()
    setSelectedId('')
  }

  const handleEdit = async id => {
    const selectedTodo = todos.find(todo => todo.id === id)

    setTodoDetail({
      title: selectedTodo.title,
      description: selectedTodo.description,
    })

    setSelectedId(id)
  }

  const handleDelete = async id => {
    await axios.delete(`${BASE_URL}/todos/${id}`)
    fetchTodos()
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <main>
      <h1>Easy Todo App</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={todoDetail.title}
            onChange={e =>
              setTodoDetail(prev => {
                return { ...prev, title: e.target.value }
              })
            }
            placeholder='Title'
          />
          <input
            type='text'
            placeholder='Description'
            value={todoDetail.description}
            onChange={e =>
              setTodoDetail(prev => {
                return { ...prev, description: e.target.value }
              })
            }
          />

          <button disabled={!todoDetail.title || !todoDetail.description}>
            Submit
          </button>
        </form>

        <ul>
          {todos.map(todo => (
            <Todo
              key={todo.id}
              {...todo}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return (
    <li>
      <div className='container'>
        <span>{props.title}</span>
        <br />
        {props.description}

        <span className='actions'>
          <button onClick={() => props.handleEdit(props.id)}>Edit</button>
          <button onClick={() => props.handleDelete(props.id)}>Delete</button>
        </span>
      </div>
    </li>
  )
}

export default App
