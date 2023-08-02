// import { useState, useEffect } from "react";
// import "./App.css";

// function useTodos() {
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/todos", {
//       method: "GET",
//     })
//       .then((response) => {
//         if (response.ok) {
//           response.json().then((data) => {
//             console.log(data);
//             setTodos(data);
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);
//   return [todos, setTodos];
// }

// function ListallTodos() {
//   const [todos, setTodos] = useTodos();
//   const Handledelete = (id) => {
//     fetch("http://localhost:3000/todos/" + id, {
//       method: "DELETE",
//     }).then((response) => {
//       if (response.ok) {
//         setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//       }
//     });
//   };

//   return (
//     <div>
//       {todos.map((todo) => {
//         return (
//           <div key={todo.id}>
//             <span>{todo.title}</span>
//             <span>{todo.description}</span>
//             <button onClick={() => Handledelete(todo.id)}>delete</button>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function CreateTodo() {
//   const [todos, setTodos] = useTodos();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const addTodo = () => {
//     fetch("http://localhost:3000/todos", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ title: title, description: description }),
//     }).then((response) => {
//       if (response.ok) {
//         response.json().then((data) => {
//           setTodos((prevTodos) => [...prevTodos, data]);
//         });
//       }
//     });
//   };

//   return (
//     <div>
//       <form onSubmit={addTodo}>
//         <input
//           type="text"
//           value={title}
//           onChange={(event) => setTitle(event.target.value)}
//         />
//         <input
//           type="text"
//           value={description}
//           onChange={(event) => setDescription(event.target.value)}
//         />
//         <button type="submit">Add</button>
//       </form>
//     </div>
//   );
// }

// function App() {
//   return (
//     <>
//       <div>
//         <CreateTodo></CreateTodo>
//         <ListallTodos></ListallTodos>
//       </div>
//     </>
//   );
// }

// export default App;

// with components
// import React from "react";
// import CreateTodo from "./CreateTodo";
// import ListallTodos from "./ListallTodos";

// function App() {
//   return (
//     <div>
//       <CreateTodo />
//       <ListallTodos />
//     </div>
//   );
// }

// export default App;
import CreateTodo from "./create";
import ListallTodos from "./Listall";

function App() {
  return (
    <div>
      <CreateTodo />
      <ListallTodos />
    </div>
  );
}

export default App;
