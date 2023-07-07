import { useEffect, useState } from 'react'
import axios from 'axios'
import NewTodo from './Components/NewTodo/NewTodo'
import Todos from './Components/TodoList/Todos'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
    // fetch all todos from server
  useEffect(() => {
    async function fetchData(){
      const x = await axios.get('http://127.0.0.1:3000/todos');
      setTodos(x.data);
    }

    fetchData();
  
  },[])
  
  const newTodoData = (todoData) => {
    async function postData(){
      const data =  await axios.post('http://127.0.0.1:3000/todos', todoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    }

    postData();

    
    setTodos([...todos , todoData]);
  }
  const deleteHandler = (deletedTodo) => {
      axios.delete(`http://127.0.0.1:3000/todos/${deletedTodo.id}`).then(response => {
      console.log(`Deleted post with ID ${deletedTodo.id}`);
    }).catch(error => {
      console.error(error);
    });
    
    const filiterdTodos = todos.filter(todo => todo.id != deletedTodo.id);
    setTodos([...filiterdTodos]);
  }
  return (
    <>
      <NewTodo onSaveNewTodoData={newTodoData}/>
      <Todos todos={todos} onDeleteHandler={deleteHandler} />
    </>
  )
}

// function Todo(props) {
//     // Add a delete button here so user can delete a TODO.
//     return <div>
//         {props.title}
//     </div>
// }

export default App
