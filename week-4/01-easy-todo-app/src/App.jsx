import './App.css';
import { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo, putTodo } from './helpers/todo.helper';
import NewTodo from './components/NewTodo';
import Todo from './components/Todo';

export default function App() {
  const [todos, setTodos] = useState([]);
  // fetch all todos from server
  useEffect(() => {
    getTodos().then((res) => setTodos(res?.data));
  }, []);

  function createTodo(todo, callback) {
    postTodo(todo).then((res) => {
      callback();
      setTodos((prev) => [...prev, { ...todo, ...res.data }]);
    });
  }

  function changeTodo(id) {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    putTodo(id, { completed: !todo.completed }).then((res) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? res.data : todo))
      );
    });
  }

  function removeTodo(id) {
    deleteTodo({ id }).then(() => {
      setTodos((prev) => {
        return prev.filter((todo) => todo.id !== id);
      });
    });
  }

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <NewTodo createTodo={createTodo} />
        {todos.map(({ id, title, completed, description }) => (
          <Todo
            key={id}
            title={title}
            completed={completed}
            description={description}
            handleChange={() => changeTodo(id)}
            handleDelete={() => removeTodo(id)}
          />
        ))}
      </div>
    </>
  );
}
