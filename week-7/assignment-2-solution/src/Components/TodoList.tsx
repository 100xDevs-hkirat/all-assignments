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
    <div className="mt-32 p-4 mx-[30%] bg-slate-400 w-1/3 h-1/4 flex flex-col items-center justify-center rounded-lg">
      <input
        className="text-sm w-[80%] p-4 border-blue-950 border-2 rounded-xl m-3"
        type="text"
        placeholder="title"
        value={todoTitle}
        onChange={(e) => {
          setTodoTitle(e.target.value);
        }}
      />
      <input
        className="text-sm w-[80%] p-4 border-blue-950 border-2 rounded-xl m-3"
        type="text" // Corrected "texr" to "text"
        placeholder="description"
        value={todoDescription}
        onChange={(e) => {
          setTodoDescription(e.target.value);
        }}
      />
      <button
        className="text-sm w-[80%] p-3 bg-slate-200 rounded-2xl"
        onClick={handleAddTodo}
      >
        Add Todo
      </button>
    </div>
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
      <div className="bg-slate-800 w-1/4 h-1/2 flex flex-col items-center justify-center rounded-lg mt-11 mx-[30%] p-1">
        <div className="text-white text-3xl m-2 border-slate-800 border-2 border-b-slate-400">
          Todos
        </div>
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
    <div className="flex rounded-lg w-[80%] h-10">
      <input
        className="p-4 border-yellow-50 border-2 m-3 w-3"
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
      <div className="m-1 p-1 text-blue-100 ">
        <h1>{props.title}</h1>
        {/* <h3 className="m-1">{props.description}</h3> */}
      </div>
    </div>
  );
}

export default TodoList;
