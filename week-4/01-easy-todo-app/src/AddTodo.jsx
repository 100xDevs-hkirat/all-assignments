import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const AddTodo = () => {
  const [todo, setTodo] = useState({
    title: "",
    description: "",
  });
  const [status, setStatus] = useState('');

  const add = async (e) => {
    e.preventDefault();
    // interacting with the backend using axios library
    const { description, title } = todo;
    try {
      await axios.post(`${BASE_URL}/todos`, {
        id: Math.random(),
        title,
        description,
      });
      setStatus('succesfully added todo to the backend !');
      console.log("succesfully added todo to the backend !");
    } catch (err) {
      console.log(err);
      setStatus('Got Error while adding todo to the backend !');
    }
  };

  return (
    <div>
      <h1>Add Todos to the Server : </h1>
      <form onSubmit={(e) => add(e)} action="post">
        <input
          type="text"
          placeholder="Title"
          value={todo.title} // Add value prop
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Description"
          value={todo.description} // Add value prop
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        />
        {/* <br></br> */}
        <br></br>
        {status && <p style={{ color: 'red' }}>{status}</p>}
        <br></br>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTodo;
