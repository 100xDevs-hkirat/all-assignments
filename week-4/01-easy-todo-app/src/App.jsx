import { useEffect, useState } from "react";
import "./App.css";
const fetchTodos = (setTodos)=>{
  fetch("http://localhost:3000/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((todos) => {
      setTodos(todos);
    });
}
function App() {
  const [todos, setTodos] = useState([]);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  // fetch all todos from server
 
  useEffect(()=>{
    fetchTodos(setTodos);
  },[])
  const handleClickAdd = () => {
    console.log(title,description);
    const todo = {
      title: title,
      description: description,
    };
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then(fetchTodos(setTodos));

  };


  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="Title"
        />
        <br />
        <br />
        <textarea
          value={description}
          rows={4}
          cols={15}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          placeholder="Description"
        />
      </div>
      <button style={{ marginTop: "20px" }} onClick={handleClickAdd}>
        ADD
      </button>
      <Todo todos={todos} setTodos={setTodos}/>
    </>
  );
}

function Todo(props) {
  const handleClickDelete = (id) => {
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(()=>fetchTodos(props.setTodos));
    
  };
  // Add a delete button here so user can delete a TODO.
  // console.log(props.todos,props.setTodos);
  return <div style={{ border: "2px solid #333", padding: "10px" }}> {props.todos.map((todo) => (
    <div key={todo.id}>
      <p>Title: {todo.title}</p>
      <p>Description: {todo.description}</p>
      <button style={{ marginTop: "20px" }} onClick={()=>handleClickDelete(todo.id)}>DELETE</button>
    </div>
  ))}</div>
}

export default App;
