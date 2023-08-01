import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'

function useTodo() {
  const [todo, setTodo] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/todos").then((res) => {
      res.json().then((data) => {
        console.log(data);
        setTodo(data);
      });
    });

    setInterval(() => {
      fetch("http://localhost:3000/todos").then((res) => {
        res.json().then((data) => {
          setTodo(data);
        })
      });
    }, 1000)
  }, []);

  return todo;
}

function App() {
  return (
    <>
      <Head></Head>
      <br /><br />
      <UserInput></UserInput>
      <br /><br />
      <MainArea></MainArea>
    </>
  )
}

function MainArea() {
  const todo = useTodo();

  const onDelete = (id) => {
    console.log(`deleting ${id}`);
    const result = confirm(`Do you want to delete todo having id - ${id}`);
    if (!result) {
      return;
    }

    axios({
      method: "DELETE",
      url: `http://localhost:3000/todos/${id}`
    }).then((res) => {
      console.log(res);
    })
  };

  return <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Id</th>
          <th>Title</th>
          <th>Description</th>
        </tr>
      </thead>
    </table>
    {todo.map((element) => {
      return <div key={element.id}>
        <table>
          <tbody>
            <tr>
              <td><button onClick={() => onDelete(element.id)}>Delete</button></td>
              <td>{element.id}</td>
              <td>{element.title}</td>
              <td>{element.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    })}
  </div>
}

function UserInput() {

  const onPress = () => {
    let todoTitle = document.getElementById("title").value;
    let todoDescription = document.getElementById("description").value;

    if (todoTitle === "" || todoDescription === "") {
      console.log("input required");
      return;
    } else {
      fetch("http://localhost:3000/todos", {
        method: "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: todoTitle,
          description: todoDescription,
        }),
      }).then((res) => {
        res.json().then((data) => {
          console.log(data);
          // todoTitle.value = "";
          // todoDescription.value = "";
        });
      });
    }
  }

  return <div>
    <div className="input-field">
      <b>Todo Title</b>: <input type="text" id="title" placeholder="enter title" /><br />
    </div>
    <div className="input-field">
      <b>Description:</b> <input type="text" id="description" placeholder="enter description" /><br />
    </div>
    <input type="submit" onClick={onPress} value="Add todo" className="submit-button" /><br /><br /><br />
  </div>
}

function Head() {
  return <div className="mainHead">
    <div className="logo-container">
      <img src="./src/todologo.png" alt="Logo" className="logo" />
    </div>
    <h1 className="app-name">Todo App</h1>
    <p className="tagline">Stay organized and get things done!</p>
  </div>
}

export default App
