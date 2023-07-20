import { useEffect, useState } from "react";
import "./App.css";
import AddTodo from "./Components/AddTodo";
import DisplayTodos from "./Components/DisplayTodos";
import "../public/style.css";

function App() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server
  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        console.log("Data Fetched! " + data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div>
        <div className="container">
          <AddTodo setTodos={setTodos} todos={todos} />
        </div>
        <DisplayTodos todos={todos} setTodos={setTodos} />
      </div>
    </>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>{props.title}</div>;
}

export default App;
