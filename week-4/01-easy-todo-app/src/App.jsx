import { useEffect, useState } from "react";
import "./App.css";
import AddTodo from "./Components/AddTodo";
import DisplayTodos from "./Components/DisplayTodos";
import "./style.css";
import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:3000" });

function App() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server
  useEffect(() => {
    client
      .get("/todos")
      .then((response) => {
        setTodos(response.data);
        console.log("Data Fetched! " + response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div>
        <div className="container">
          <AddTodo setTodos={setTodos} todos={todos} client={client} />
        </div>
        <DisplayTodos todos={todos} setTodos={setTodos} client={client} />
      </div>
    </>
  );
}

export default App;
