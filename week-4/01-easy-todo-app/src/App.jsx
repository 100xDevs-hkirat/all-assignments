import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [title, setTitle] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = baseUrl;

  const createTodo = (e) => {
    e.preventDefault();
    const newTodo = {
      title,
      completed,
    };

    axios
      .post("/todos", newTodo)
      .then((res) => {
        console.log(res.data);
        setTodos([...todos, { id: res.data.id, ...newTodo }]);
      })
      .catch((err) => console.log(err));
    setTitle("");
    setCompleted(false);
  };

  const fetchTodos = () => {
    axios
      .get("/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app-container">
      <h2 className="heading">TODO</h2>
      <form onSubmit={createTodo} className="create-todo">
        <Checkbox checked={completed} setChecked={setCompleted} />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          type="text"
          placeholder="Create a new Todo"
        />
      </form>
      <div className="todos">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            setTodos={setTodos}
          />
        ))}
      </div>
    </div>
  );
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  const [completed, setCompleted] = useState(props.completed);
  const { id, setTodos } = props;
  const deleteTodo = () => {
    axios
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos((todos) => todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const updateTodo = () => {
    axios
      .put(`/todos/${id}`, { id, completed: !completed })
      .then(() => {
        setCompleted(!completed);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="todo-item">
      <Checkbox checked={completed} setChecked={updateTodo} />
      <span className={`todo-title ${completed ? "todo-complete" : ""}`}>
        {props.title}
      </span>
      <button onClick={deleteTodo} className="delete-btn">
        DELETE
      </button>
    </div>
  );
}

const Checkbox = (props) => {
  const { checked, setChecked } = props;
  return (
    <span
      checked={checked}
      onClick={() => setChecked(!checked)}
      className={`checkbox ${checked ? "checkbox-checked" : ""}`}
    />
  );
};

export default App;
