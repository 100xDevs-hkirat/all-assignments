/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import "./App.css";
import AddTodo from "./AddTodo";
import axios from "axios";

const useTodos = (todos, setTodos) => {
  // Custom Hook Example
  useEffect(() => {
    console.log("re-rendering ? ");
    setInterval(() => {
      fetch("http://localhost:3000/todos").then((res) => {
        res.json().then((data) => {
          setTodos(data);
        });
      });
    }, 10000);
  }, []);

  return todos;
};

function App() {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState('');

  const allTodos = useTodos(todos, setTodos);

  const getTodos = () => {
    fetch("http://localhost:3000/todos").then((res) => {
        res.json().then((data) => {
          setTodos(data);
        });
      });
  }

  const deleteF = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`)
      getTodos();
      setStatus(`Todo ${id} Succesfully Deleted !`);
      console.log(`Todo ${id} Succesfully Deleted !`)
    } catch (err) {
      console.log(err);
      setStatus('Error while deleting the todo !');
    }
  };


  return (
    <>
      <div>
        <AddTodo />
        {allTodos.map((todo, i) => (
          <div key={i} style={{display: 'flex', alignItems:'center'}}>
            <h4>{todo.title}</h4>
            <button onClick={(e) => deleteF(e, todo.id)}>Delete Todo</button>
          </div>
        ))}
        {status && <p style={{ color: 'red' }}>{status}</p>}
      </div>
    </>
  );
}

export default App;
