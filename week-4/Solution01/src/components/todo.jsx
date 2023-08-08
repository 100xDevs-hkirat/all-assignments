import { useEffect, useState } from "react";
import axios from "axios";


const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [inputValue2, setInputValue2] = useState("");
  
    useEffect(() => {
      fetchTodos();
    }, []);
  
    // const fetchTodos = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:4000/todos");
    //       setTodos(response.data);
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   };
    const fetchTodos = () => {
        axios.get("http://localhost:3000/todos").then(response => {
            setTodos(response.data);
          }).catch(error => {
            console.log(error);
          });
      };
      
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
    const handleInputChange2 = (event) => {
        setInputValue2(event.target.value);
      };
    // const handleAddTodo = async () => {
    //   if (inputValue.trim() !== "") {
    //     try {
    //       const response = await axios.post("http://localhost:4000/todos", {
    //         title: inputValue,
    //         description: "",
    //       });
    //       setTodos([...todos, response.data]);
    //       setInputValue("");
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // };
    const handleAddTodo = () => {
        //here it checks that if the input value is not empty then send the post request
        if (inputValue.trim() !== "") {
          axios.post("http://localhost:3000/todos", {
              title: inputValue,
              description: inputValue2,
            }).then(response => {
              setTodos([...todos, response.data]);
              setInputValue("");
              setInputValue2("");
            }).catch(error => {
              console.log(error);
            });
        }
      };
      
  
    // const handleDeleteTodo = async (index) => {
    //   const todoId = todos[index].id;
    //   try {
    //     await axios.delete(`http://localhost:4000/todos/${todoId}`);
    //     const updatedTodos = todos.filter((_, i) => i !== index);
    //     setTodos(updatedTodos);
    //   } catch (error) {
    //     console.error("Error deleting todo:", error);
    //   }
    // };
    const handleDeleteTodo = (index) => {
        const todoId = todos[index].id;
        axios.delete(`http://localhost:3000/todos/${todoId}`).then(() => {
            const updatedTodos = todos.filter((_, i) => i !== index);
            setTodos(updatedTodos);
          }).catch(error => {
            console.error("Error deleting todo:", error);
          });
      };
      
  
    return (
      <div>
        <h1 >Todo App</h1>
        <div>
          <input
            type="text"
            placeholder="Enter a todo"
            value={inputValue}
            onChange={handleInputChange}
          /> <br />
          <input
            type="text"
            placeholder="Enter the description"
            value={inputValue2}
            onChange={handleInputChange2}
          /> <br />
          <button className="add" onClick={handleAddTodo}>ADD</button>
        </div>
        <ul >
          {todos.map((todo, index) => (
            <li key={index}>
              <span className="title">{todo.title}</span>
              <br />
              <span className="description">{todo.description}</span>
              <button className="add" onClick={() => handleDeleteTodo(index)}>DELETE</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TodoApp;



