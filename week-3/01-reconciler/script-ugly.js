function createDomElements(data) {
    var parentElement = document.getElementById("mainArea");
  
    // Clear all existing children of the parentElement
    parentElement.innerHTML = '';
  
    let added = 0;
    // Process each item in the data array
    data.forEach(function(item) {
      added++;
      // Create a new element
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups
  
      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title
  
      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description
  
      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete"
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")
  
      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);
    });
  
    console.log(added);
  }
  
  
  //THE ABOVE IS i.e createDomElements THE RECOSILER FUNCTION , we have done the updating and deleting logic in this function so that others don't need to dwell into the DOM and all things  they just specify things like what to be added and deleted and how many times etc ,for like this in numerous  other cases , THIS IS WHAT REACT DOES BEHIND THE SCENES.

  
  
  window.setInterval(() => {
    let todos = [];
    for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
      todos.push({
        title: "Go to gym",
        description: "Go to gym form 5",
        id: i+1
      })
    }
  
    createDomElements(todos)
  }, 5000)
  



  /**  USING REACT TO IMPLEMT THE ABOVE FUNCTIONALITY 


  *Set Up a React Project:
       npx create-react-app my-react-app
       cd my-react-app


*Create the React Component:
 import React, { useState, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTodos = [];
      for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
        newTodos.push({
          title: "Go to gym",
          description: "Go to gym from 5",
          id: i + 1
        });
      }
      setTodos(newTodos);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div id="mainArea">
      {todos.map(item => (
        <div key={item.id} data-id={item.id}>
          <span>{item.title}</span>
          <span>{item.description}</span>
          <button onClick={() => deleteTodo(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;




*Render the React Component:

Use the Component in Your App:
import React from 'react';
import './App.css';
import TodoList from './TodoList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
        <TodoList />
      </header>
    </div>
  );
}

export default App;

   */