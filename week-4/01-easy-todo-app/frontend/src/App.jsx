import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/todos");
      const todos = await response.json();
      setTodos(todos.data.todo);
      console.log(todos.data.todo);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (content.title.trim() === "") {
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/v1/add", {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const addedTask = await response.json();
      setTodos((prevTasks) => [...prevTasks, addedTask]);
      setContent({
        title: "",
        description: "",
      });
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/v1/delete/${id}`, {
        method: "DELETE",
      });
      setTodos((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

const handleUpdateTask = async (id, updatedContent) => {
  try {
    const response = await fetch(`http://localhost:3001/api/v1/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedContent),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const updatedTask = await response.json();
    setTodos((prevTasks) =>
      prevTasks.map((task) => (task._id === id ? updatedTask.data.todo : task))
    );
  } catch (error) {
    console.log("Error updating task:", error);
  }
};

  const handleChange = (event) => {
    const { name, value } = event.target;

    setContent((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContent({
      title: "",
      description: "",
    });
  };

  return (
    <>
    <Header/>
      <form className="form-input">
        <input
          type="text"
          name="title"
          value={content.title}
          onChange={handleChange}
          placeholder="Add title"
        />
        <input
          className="description"
          type="text"
          name="description"
          value={content.description}
          onChange={handleChange}
          placeholder="Write the description"
        />
        <button onClick={handleAddTask}>Add</button>
      </form>
      <main>
      {todos.map((item) => (
        <Item
          key={item._id}
          id={item._id}
          title={item.title}
          description={item.description}
          handleDelete={handleDelete}
          handleUpdate={handleUpdateTask}
        />
        
      ))}
      </main>
    </>
  );
}
function Header () {
  return <header>
    <h1>Simple Todo App</h1>

  </header>
}

function Item({ id, title, description, handleDelete, handleUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({ title, description });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    handleUpdate(id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent({ title, description });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditedContent((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div>
      {isEditing ? (
        <>
        <div className="content">
          <input
          
            type="text"
            name="title"
            value={editedContent.title}
            onChange={handleChange}
          />
          <input
            name="description"
            value={editedContent.description}
            onChange={handleChange}
          />
             <div className="btn-div">
          <button className="edit" onClick={handleSave}>Save</button>
          <button className="delete" onClick={handleCancel}>Cancel</button>
          </div>
          </div>
        </>
      ) : (
        <>
        <div className="content">
          <h2>{title}</h2>
          <h3>{description}</h3>
         <div className="btn-div">
         <button className="edit" onClick={handleEdit}>Edit</button>
          <button className="delete" onClick={() => handleDelete(id)}>Delete</button>
         </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
