import { useState } from 'react'

import './App.css'
import Todo from './components/Todo'

function App() {

  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [todos,setTodos]= useState([]);

  let handleTitle = (e) =>{
    setTitle(e.target.value);
  }

  let handleDescription = (e) =>{
    setDescription(e.target.value);
  }

  let handleOnClick = (e) => {
    const newTodo = {
      id: todos.length+1, // Using a timestamp as a unique ID
      title,
      description,
    };
    setTodos([...todos, newTodo]);
    setTitle('');
    setDescription('');
  };
  
  return (
    <>
        <div>
          Title
          <input type="text" name="title" id="" onChange={handleTitle}/>
          Description
          <input type="text" name="description" id="" onChange={handleDescription}/>
          <button onClick={handleOnClick}>Add Todo</button>
        </div>
        

        <Todo todos={todos} />

    </>
  )
}

export default App
