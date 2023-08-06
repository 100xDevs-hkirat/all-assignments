import { useState, useEffect } from "react";
import { authState } from "../store/authState";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { Todo } from "../types";
import { ENV } from "../env";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const getTodos = async () => {
      const response = await fetch(`${ENV.VITE_BASE_URL}/todo/todos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data: Todo[] = await response.json();
      setTodos(data);
    };
    getTodos();
  }, [auth.token]);

  const addTodo = async () => {
    const response = await fetch(`${ENV.VITE_BASE_URL}/todo/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data: Todo = await response.json();
    setTodos([...todos, data]);
  };

  const markDone = async (id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/todo/todos/${id}/done`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const updatedTodo: Todo = await response.json();
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Welcome {auth.username}</h2>
        <div style={{ marginTop: 25, marginLeft: 20 }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={addTodo}>Add Todo</button>
      {todos.map((todo) => (
        <div key={todo.id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <button onClick={() => markDone(todo.id)}>
            {todo.done ? "Done" : "Mark as Done"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
