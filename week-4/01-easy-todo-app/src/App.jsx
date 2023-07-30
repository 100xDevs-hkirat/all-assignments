import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import Todo from './components/Todo';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/todos').then((res) => {
      const todosFromServer = res.data;
      console.log('todos' + todosFromServer);
      setTodos(todosFromServer);
    });

    setInterval(() => {
      axios.get('http://localhost:3000/todos').then((res) => {
        const todosFromServer = res.data;
        console.log('todos' + todosFromServer);
        setTodos(todosFromServer);
      });
    }, 2000);
  }, []);

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then((response) => {
        console.log(`deleted todo with id ${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <h3>Todos</h3>
        {todos.map((todo) => {
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              title={todo.title}
              description={todo.description}
              deleteTodo={() => deleteTodo(todo.id)}
            ></Todo>
          );
        })}
      </div>
    </>
  );
}

// function Todo(props) {
//   // Add a delete button here so user can delete a TODO.
//   return (
//     <div>
//       {props.title}
//       <br />
//       {props.description}
//       <br />
//       <button>X</button>
//     </div>
//   );
// }

export default App;
