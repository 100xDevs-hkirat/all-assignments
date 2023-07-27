import { useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { todoAtom } from "../store/todo/todo";
import { useEffect } from "react";
import axios from "axios";

type TodoItemType = {
  _id: string;
  title: string;
  description: string;
  done: boolean;
};

function AddTodo() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const setTodos = useSetRecoilState<Array<TodoItemType>>(todoAtom); // Get the set function for the todoAtom

  const handleAddTodo = () => {
    axios
      .post(
        "http://localhost:3000/todo/todos",
        {
          title: todoTitle,
          description: todoDescription,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setTodos((prevTodos) => [
          ...prevTodos,
          {
            _id: res.data._id,
            title: todoTitle,
            description: todoDescription,
            done: false,
          },
        ]);
      });

    setTodoTitle(""); // Clear the input after adding todo
    setTodoDescription(""); // Clear the input after adding todo
  };

  return (
    <>
      <input
        type="text"
        placeholder="title"
        value={todoTitle}
        onChange={(e) => {
          setTodoTitle(e.target.value);
        }}
      />
      <input
        type="text" // Corrected "texr" to "text"
        placeholder="description"
        value={todoDescription}
        onChange={(e) => {
          setTodoDescription(e.target.value);
        }}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
    </>
  );
}

function TodoList() {
  const setTodos = useSetRecoilState(todoAtom);
  useEffect(() => {
    axios
      .get("http://localhost:3000/todo/todos", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setTodos(res.data);
      });
  }, []);
  const Todos = useRecoilValue(todoAtom);
  return (
    <>
      <div>
        {Todos.filter((todo) => !todo.done).map((todo) => (
          <DisplayTodos
            title={todo.title}
            key={todo._id}
            description={todo.description}
            id={todo._id}
          />
        ))}
      </div>
      <AddTodo />
    </>
  );
}

function DisplayTodos(props: {
  title: string;
  description: string;
  id: number | string;
}) {
  const [todos, setTodos] = useRecoilState<Array<TodoItemType>>(todoAtom);
  return (
    <div className="flex">
      <input
        type="checkbox"
        onClick={() => {
          const updatedTodos = todos.map((todo) =>
            todo._id === props.id ? { ...todo, done: true } : todo
          );

          setTodos(updatedTodos);
          axios.patch(
            `http://localhost:3000/todo/todos/${props.id}/done`,
            null,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        }}
      />
      <div className="m-3 p-3 text-black border-blue-400 border-2">
        <h1>{props.title}</h1>
        <h3>{props.description}</h3>
      </div>
    </div>
  );
}

export default TodoList;
