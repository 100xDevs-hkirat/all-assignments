import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function useTodo() {
  const [todo, setTodo] = useState([]);
  //useEffect
  useEffect(() => {
    setInterval(() => {
      fetch("http://localhost:3000/todos").then((response) => {
        response.json().then((data) => {
          console.log(data);
          setTodo(data);
        });
      });
    }, 2000);
  }, []);


  return todo;
}

function App() {
  const todo = useTodo();

  return (
    <>
      <ListTodo todos={todo}></ListTodo>
    </>
  );
}

function DeleteTodo(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => {
    console.log("Delete Done");
    // Refresh the displayed todos after deletion
    //getData();
  });
  console.log("sadklhfkjdsafdk", id);
}

function ListTodo(props) {
  return (
    <>
      {props.todos.map((todo) => {
        return (
          <div>
            {todo.title}
            {todo.description}
            <button className="deletebtn" onClick={() => DeleteTodo(todo.id)}>
              Delete
            </button>
            <br />
          </div>
        );
      })}
    </>
  );
}
export default App;
