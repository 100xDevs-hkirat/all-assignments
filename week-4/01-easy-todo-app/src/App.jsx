import { useState, useEffect } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);

    // fetch all todos from server
  const handleClick = () => {
      const url = 'http://localhost:3000/todos';
      const data = {
        title,
        description
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log('Raw response:', response);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
//             console.log(result);
//           setResponse(result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input placeholder="Title" type="text" onChange={e => setTitle(e.target.value)} />
        <br/>
        <input placeholder="Description" type="text" onChange={e => setDescription(e.target.value)} />
        <br/>
        <button onClick = {handleClick}> Add Todo </button>
        <br/>
        <Todolist/>
      </div>
    </>
  )
}

function Todolist() {
    const [x, setX] = useState(null);
    const handleDelete = (id) => {
        let todoId = id;
        fetch(`http://localhost:3000/todos/${todoId}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log('Todo deleted successfully');
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }
    useEffect( () => {

          fetch('http://localhost:3000/todos')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Response:', data);
            // Process the response data here
            setX(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },[])



    return (
        <>
            <h1> Todo List </h1>
            {x !== null ? (
                      x.map(todo => (
                        <div key={todo.id}>
                          <b>{todo.title}</b>
                          <>{"  "+ todo.description}</>
                          <button
                            onClick = {() => {handleDelete(todo.id)}}
                          >delete</button>
                        </div>
                      ))
                    ) : (
                      <p>Loading todos...</p>
                    )}
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