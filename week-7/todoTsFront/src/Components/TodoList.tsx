import { useState, useEffect } from "react";
import { authState } from "../store/authState.js";
import { useRecoilValue } from "recoil";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 Charecters long" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 charecters long." }),
});
type FormData = z.infer<typeof schema>;
interface Todo {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const authStateValue = useRecoilValue(authState);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const getTodos = async () => {
      const response = await fetch("http://localhost:3000/todo/todos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Todo: Create a type for the response that you get back from the server
      const data: Todo[] = await response.json();
      setTodos(data);
    };
    getTodos();
  }, []);

  const addTodo = async (formData: FieldValues) => {
    const response = await fetch("http://localhost:3000/todo/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setTodos([...todos, data]);
    reset();
  };

  const markDone = async (id: string) => {
    const response = await fetch(
      `http://localhost:3000/todo/todos/${id}/done`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const updatedTodo = await response.json();
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Welcome {authStateValue.username}</h2>
        <div style={{ marginTop: 25, marginLeft: 20 }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <h2>Todo List</h2>
      {/* <input
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
      <button onClick={addTodo}>Add Todo</button> */}
      <form onSubmit={handleSubmit(addTodo)}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            {...register("title")}
            id="title"
            className="form-control"
            type="text"
            //   value={username}
            //   onChange={(e) => setUsername(e.target.value)}
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            {...register("description")}
            id="description"
            className="form-control"
            type="text"
            //   value={password}
            //   onChange={(e) => setPassword(e.target.value)}
            placeholder="description"
          />
          {errors.description && (
            <p className="text-danger">{errors.description.message}</p>
          )}
        </div>
        <button className="btn btn-primary " type="submit">
          Add Todo
        </button>
      </form>
      {todos.map((todo) => (
        <div key={todo._id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <button onClick={() => markDone(todo._id)}>
            {todo.done ? "Done" : "Mark as Done"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
