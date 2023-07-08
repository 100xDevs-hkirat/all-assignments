
import { useEffect, useState } from 'react'
import './App.css'
import TodoList from '../component/TotdoList'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [todos, setTodos] = useState([])
  const [fetchAll, setFetchAll] = useState(false)

  // fetch all todos from server
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const _fetchtodo = await fetch(`http://localhost:4000/todos`);
        const res = await _fetchtodo.json();
        console.log(res.length);
        if (res.length === 0) {
          throw new Error('No data available.');
        } else {
          setTodos([...res]);
        }
      } catch (error) {
        console.error(error);
        setTodos([])
        // Handle the error appropriately, e.g., set an error state or display an error message.
      }
    };
    fetchTodo();
  }, [fetchAll]);


  const submitBtnClick = async (e) => {
    e.preventDefault()
    if (title.length === 0 && description.length === 0) {
      setError('title or descitpion should not be empty')
      return
    }
    console.log('title', title)
    console.log('description', description)
    try {
      const response = await fetch(`http://localhost:4000/todos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      },)
      if (!response.ok) {
        throw new Error('Something wen wrong')
      }
      const data = await response.json()
      console.log(data)
      setFetchAll((fetch) => !fetch)
      setTitle('')
      setDescription('')
    } catch (error) {
      console.log(error)
    }
  }
  const deletebtn = async (id) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:4000/todos/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'Application/json'
        }
      }
      )
      if (response.ok) {
        console.log('deleted successfully')
        setFetchAll(fetch => !fetch)
      } else {
        throw new Error('Something went wrong')
      }
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <>
      <div className='todo-container'>
        <h1>Easy Todo App</h1>
        <form onSubmit={submitBtnClick}>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" onChange={(e) => (
              setError(''),
              setTitle(e.target.value)
            )} value={title} name='title' id='title' />
            <p style={{ color: 'red' }}>{error}</p>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input type="text" onChange={(e) => (setError(''), setDescription(e.target.value))} value={description} name="description" id="description" />
            <p style={{ color: 'red' }}>{error}</p>
          </div>
          <div><button>Submit</button></div>
        </form>
      </div>
      <div>
        {
          todos.length === 0 ? (<div>No Data Available</div>) :
            (todos.map(todo => (
              <TodoList key={todo.id} id={todo.id} title={todo.title} description={todo.description} onDelete={deletebtn} />
            )))
        }
      </div>
    </>
  )
}


export default App
