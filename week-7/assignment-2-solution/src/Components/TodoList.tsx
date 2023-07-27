import { useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { todoAtom } from "../store/todo/todo";

type TodoItemType = {
  id: number | string;
  title: string;
  description: string;
  done: boolean;
};

function AddTodo() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const setTodos = useSetRecoilState<Array<TodoItemType>>(todoAtom); // Get the set function for the todoAtom

  const handleAddTodo = () => {
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: prevTodos.length + 1,
        title: todoTitle,
        description: todoDescription,
        done: false,
      },
    ]);
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
  const Todos = useRecoilValue(todoAtom);
  return (
    <>
      <div>
        {Todos.filter((todo) => !todo.done).map((todo) => (
          <DisplayTodos
            title={todo.title}
            key={todo.id}
            description={todo.description}
            id={todo.id}
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
        // onClick={() => {
        //   const updateTodos = todos.map((todo)=>{
        //     todo.id === props.id ? {...todo , done:true} : todo
        //   });
        //   setTodos(updateTodos);
        // }}
        onClick={() => {
          const updatedTodos = todos.map((todo) =>
            todo.id === props.id ? { ...todo, done: true } : todo
          );
          setTodos(updatedTodos);
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
