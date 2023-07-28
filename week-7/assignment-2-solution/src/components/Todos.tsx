import React, { useEffect, useState } from "react";
import authState from "../store/authState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ITodo } from "../store/interface";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Array<ITodo>>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //   const authStateValue = useRecoilValue(authState);
  // const [authStateValue, setAuthState] = useRecoilState(authState);
  const authStateValue = useRecoilValue(authState);
  const setAuthState = useSetRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const getTodos = async () => {
      try {
        // const res = await fetch("http://localhost:3000/todo/todos", {
        //   method: "GET",
        //   headers: {
        //     Authorization: `Bearer ${authStateValue.token}`,
        //   },
        // });
        const res = await axios.get("/todo/todos");
        if (res.status === 200) {
          // const data: Array<ITodo> = await res.json();
          const data: Array<ITodo> = res.data;
          setTodos(data);
        } else {
          console.error("Error /todos");
        }
      } catch (e) {
        alert(e);
      }
    };
    getTodos();
  }, [authStateValue]);

  const addTodo: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
    try {
      // const res = await fetch("http://192.168.152.215:6000/todo/todos", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${authStateValue.token}`,
      //   },
      //   body: JSON.stringify({ title: title.toUpperCase(), description }),
      // });
      const res = await axios.post("/todo/todos", {
        title: title.toUpperCase(),
        description,
      });
      // const data: ITodo = await res.json();
      const data: ITodo = res.data;
      setTodos([...todos, data]);
    } catch (e) {
      //   alert(e);
      console.log(e);
    }
  };

  const markDone = async (id: string | number) => {
    // const res = await fetch(`http://192.168.152.215:6000/todo/todos/${id}/done`, {
    //   method: "PATCH",
    //   headers: {
    //     Authorization: `Bearer ${authStateValue.token}`,
    //   },
    // });
    const res = await axios.patch(`/todo/todos/${id}/done`);

    // const updatedTodo: ITodo = await res.json();
    const updatedTodo: ITodo = res.data;
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  return (
    <div style={{ margin: 10, marginLeft: 20 }}>
      <div style={{ display: "flex" }} className="todo-header">
        <h2>Welcome {authStateValue.username?.split("@")[0].toUpperCase()}</h2>
        <div style={{ marginTop: 25, marginLeft: 20, top: 5, right: 5}}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setAuthState({ username: null, token: null });
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <h2>Todo List</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={title}
          placeholder="Title"
          autoComplete="off"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={description}
          placeholder="Description"
          autoComplete="off"
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      <div className="todoContainer">
        {todos.map((todo) => (
          <div key={todo._id} className="todoCard">
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <button onClick={() => markDone(todo._id)}>
              {todo.done ? "Done" : "Mark as Done"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
