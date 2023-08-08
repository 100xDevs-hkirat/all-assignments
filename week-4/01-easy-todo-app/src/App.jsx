import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Todo from './Todo'
import { atom, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { alltodos, getTodos } from './components/atom'
export const baseUrl = `http://localhost:3000`

function App() {
  const [todos, setTodos] = useRecoilState(alltodos);
  const todoFromSelector = useRecoilValueLoadable(getTodos);
  // const [todos, setTodos] = useState([]);
  const [disabled, setDisable] = useState(0);
    // fetch all todos from server
    useEffect(() => {
      fetch(`${baseUrl}/todos`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
    }, []);

    const titleRef = useRef(null);
    const desRef = useRef(null);

    const handleCreate = (e) => {
      e.preventDefault();
      setDisable(1);
      const request = {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          title: titleRef.current.value,
          description: desRef.current.value
        })
      }
      fetch(`${baseUrl}/todos`, request)
      .then(response => response.ok && response.json())
      .then(data => setTodos(prevTodo => [...prevTodo, data]))
      .catch(err => console.error(err));
      setDisable(0);
    }
    const handleDelete = (id) => {
      setDisable(1);
      const confirm = prompt("Do you want to delete the todo? 'y/'n'");
      if(confirm.toLowerCase() == 'n') {
        return;
      }
      fetch(`${baseUrl}/todos/${id}`, {
        method: "DELETE",
      }).then(response => {
        if(response.status == 404) {
          alert("Internal Server Error || Can't delete this todo")
          return;
        }
        if(response.status == 200) {
          setTodos(preTodos => preTodos.filter(preTodo => preTodo.id != id))
          setDisable(0);
        }
      })
    }

  return (
    <>
      <div className="flex flex-col items-center m-0">
        <div className="flex flex-col gap-y-6 bg-black bg-opacity-95 rounded-2xl w-fit h-fit p-10 shadow-sm drop-shadow-xl hover:shadow-white transition-shadow ease-in-out delay-100">
          <h1 className='font-mono text-4xl font-bold tracking-wide'>Create a New Todo</h1>
          <div id="postForm" className='flex flex-col gap-y-4 px-4'>
            <input ref={titleRef} type="text" id="title" className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" name="title" placeholder='Title' required maxLength="50" />
            <textarea ref={desRef} id="description" className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" name="description" rows="3" placeholder='Description' required></textarea>
            <button type="submit" onClick={handleCreate} className='transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300' disabled={disabled}>Create</button>
          </div>
        </div>
        <div className="todos flex gap-5 flex-wrap mt-7 items-end justify-center">
          {todos && todos.map((todo) => {
            return <Todo key={todo.id} todo={todo} delete={handleDelete} />
          })}
        </div>
      </div>
    </>
  )
}
export default App
