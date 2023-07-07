import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [createTodo, setCreateTodo] = useState({
    title: "",
    description: "",
  });

  // fetch all todos from server
  useEffect(() => {
    const fetchTodos = async () => {
      let allTodos = await fetch("http://localhost:4000/todos", {
        method: "GET",
      });
      let data = await allTodos.json();
      setTodos(data);
    };
    setInterval(() => {
      fetchTodos();
    }, 1000);
  }, []);

  const handleOnChange = (e) => {
    setCreateTodo({
      title: e.target.value,
    });
  };

  const handleOnCLick = () => {
    fetch("http://localhost:4000/todos", {
      method: "POST",
      body: JSON.stringify(createTodo),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log("Todo created");
        } else {
          console.log("Todo not created");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleOnDelete = (todoId) => {
    fetch(`http://localhost:4000/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          console.log("Deleted");
        } else {
          console.log("Delete not completed");
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "3px solid white",
          width: "50%",
          marginTop: "30px",
          minHeight: "300px",
          borderRadius: "20px",
        }}
      >
        {/* <h1>Easy Todo App</h1>
        <input type="text" /> */}
        <h1>To-Do List</h1>
        <div style={{ display: "flex", width: "50%" }}>
          <input
            onChange={handleOnChange}
            type="text"
            placeholder="Add your task"
            style={{
              backgroundColor: "#F0F0F0",
              border: "#FAFAFA",
              borderRadius: "18px",
              width: "100%",
              padding: "10px",
            }}
          />
          <button
            style={{
              backgroundColor: "#A8E4A0",
              border: "#A8E4A0",
              width: "30%",
              paddingLeft: "5px",
              paddingRight: "5px",
              borderRadius: "30px",
              marginLeft: "8px",
              cursor: "pointer",
            }}
            onClick={handleOnCLick}
          >
            Add
          </button>
        </div>
        <div style={{ width: "50%" }}>
          {todos.map((todo) => {
            return (
              <ul
                style={{
                  marginLeft: "0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={todo.id}
              >
                <li>{todo.title}</li>
                <button
                  style={{
                    backgroundColor: "white",
                    width: "10%",
                    border: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOnDelete(todo.id)}
                >
                  X
                </button>
              </ul>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// function Todo(props) {
//   // Add a delete button here so user can delete a TODO.
//   return (
//     <div>
//       {props.title}
//       <button>Delete</button>
//     </div>
//   );
// }

export default App;
