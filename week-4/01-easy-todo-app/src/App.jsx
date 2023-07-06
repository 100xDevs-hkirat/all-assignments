import { useEffect, useState } from 'react';
import './App.css';

const TODO_URL = 'http://localhost:3000/todos';
function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');

  useEffect(() => {
    fetch(TODO_URL)
      .then((res) => res.json())
      .then((result) => setTodos(result));
  }, []);

  const addTodo = () => {
    console.log('Add clicked' + todo);
    fetch(TODO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo,
        description: todo,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setTodos((prevTodos) => [...prevTodos, result]);
        setTodo('');
      });
  };

  const removeTodo = (id) => {
    console.log(`Remove Todo: ${id}`);
    fetch(`${TODO_URL}/${id}`, {
      method: 'DELETE',
    }).then((res) => {
      console.log(res);
      setTodos([...todos.filter((todo) => todo.id !== id)]);
    });
  };

  return (
    <>
      <div className='container'>
        <div className='card my-4'>
          <div className='card-header'>
            <h4>Easy Todo App</h4>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-9'>
                <input
                  type='text'
                  value={todo}
                  onChange={(event) => setTodo(event.target.value)}
                  className='form-control'
                />
              </div>
              <div className='col-3 d-grid'>
                <button
                  onClick={addTodo}
                  disabled={todo === ''}
                  className='btn btn-primary w-full'
                >
                  Add Todo
                </button>
              </div>
            </div>
          </div>
        </div>
        {todos.map((todo, index) => (
          <Todo todo={todo} key={todo.id} removeTodo={removeTodo} />
        ))}
      </div>
    </>
  );
}

function Todo({ todo, removeTodo }) {
  // Add a delete button here so user can delete a TODO.
  return (
    <div className='card my-1'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center gap-2'>
          <div className='flex-grow-1'>
            <h5 className='card-title'>{todo.title}</h5>
            <h6 className='card-subtitle text-secondary text-body-secondary'>
              {todo.description}
            </h6>
          </div>
          <button
            onClick={() => removeTodo(todo.id)}
            className='btn btn-danger btn-sm'
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
