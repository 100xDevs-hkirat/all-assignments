import { useEffect, useState } from "react";
import "./FetchTodos.css"
function TodosFetcher()
{
const [todos, setTodos] = useState([])


useEffect(() => {
  setInterval(()=>{
              fetch("http://localhost:3000/todos", {
              method: "GET"
              })
    .then(response => response.json())
    .then(data => {
              setTodos(data);
              })
    .catch(error => {
              console.log("error fetching data  ", error);
    })},1000);
}, [])

//delete the todo
const todosDeleter=(todo)=>{
  fetch(`http://localhost:3000/todos/${todo}`,{
  method:"DELETE",
 })}



return (
<div className="todo-list-container">
   <h3 className="todo-list-heading">YOURS TODO LIST :</h3>
      <ul className="todo-list">

{
  todos ? (
    todos.map(todo => (
           <li key={todo.id}>{todo.title.toUpperCase()}: {todo.description} <button onClick={()=>{todosDeleter(todo.id)}}>DELETE</button></li>
    ))
  ) : (
           <li>No todos available</li>
  )
}

      </ul>
  
</div>)
  
}
export default TodosFetcher;