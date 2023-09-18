import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import React from 'react'
import './App.css'

function App() {

  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  useEffect(() => {
    // Fetch todos initially
    fetchTodos();

    // Set up a timer to fetch todos
    const timer = setInterval(fetchTodos, 1000);

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const makeTodo = () => {
    const newTodo = {
      title: newTodoTitle,
      description: newTodoDescription,
    };
  
    axios.post("http://localhost:3000/todos", newTodo).then((resp) => {
      setTodos([...todos, resp.data]);
  
      // Clear the input fields
      setNewTodoTitle("");
      setNewTodoDescription("");
    });
  };
  const fetchTodos = () => {
    axios.get("http://localhost:3000/todos").then((resp) => {
      setTodos(resp.data);
    });
  };
console.log(todos);


const DeleteTodo = (id) => {
  // Delete a TODO on the server
  axios.delete(`http://localhost:3000/todos/${id}`).then(() => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  });
};

return (
  <>
  <div> <h1>Here is a list of all todos</h1>
        {todos.map((value) => (
          <div key={value.id}>
            {value.title}
            {value.description}
            <button onClick={()=> {DeleteTodo(value.id)}}>Delete Todo</button>
          </div>
        ))}
        </div>
    <div id="maketodo">
      <h1>Create your own Todo</h1>
      title: <input type="text" id="title"
      value= {newTodoTitle}
      onChange={(input)=> setNewTodoTitle(input.target.value)}
      />
       <br/> 
      description: <input type="text" 
      value={newTodoDescription}
      onChange={(input)=> setNewTodoDescription(input.target.value)}
      />
      <button onClick={makeTodo}>Create Todo</button>
    </div>
  </>
);
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    return <div>
        {props.title}
    </div>
}

export default App
