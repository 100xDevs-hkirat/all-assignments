import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() =>
    fetchTodoLists, []);

  // fetch all todos from server
  // useScript(path.join(__dirname,'./script.js'));
  function handleClick() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((resp) => {

      fetchTodoLists()
    });
  }

  function fetchTodoLists() {
    fetch("http://localhost:3000/todos")
      .then((resp) => resp.json())
      .then((todosList) => {
        setTodos(todosList);
      });
  }

  return (
    <>
      <title>Todo</title>
      {/* <link rel="stylesheet" href="./todoApp.css" /> */}
      <form>
        <div className="container">
          <div className="box">
            <div className="title">
              <label htmlFor="title" style={{ marginRight: "10px" }}>Title</label>
              <input type="text" name="title" id="title" />
            </div>
            <br />
            <div className="description" >
              <label htmlFor="description" style={{ marginRight: "10px" }}>Description</label>
              <input type="text" name="description" id="description" />
            </div>
            <br />
            <div className="submit">
              <button type="submit" name="submit" id="submit" onClick={handleClick}>
                Send Todo
              </button>
            </div>
            <div id="displayArea">
              {todos.map(todo => {
                return <div key={todo.id}>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <Delete id={todo.id} />
                </div>
              })}
            </div>
          </div>
        </div>
      </form>
    </>

  )
}


function Delete({ id }) {
  // Add a delete button here so user can delete a TODO.
  function handleDelete() {
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE"
    }).then((resp) => {

      fetchTodoLists()
    });
  }

  return <button onClick={handleDelete}>Delete</button>
}
export default App