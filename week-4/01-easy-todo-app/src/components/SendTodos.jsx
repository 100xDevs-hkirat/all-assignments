import { useState } from "react";
import "./SendTodos.css"
function CreateNewTodo(){
    const [newTodo, setnewTodo] = useState({ title: "", description: "" });

  const handleInputChange=(event)=>{
     const {name,value}=event.target;
     setnewTodo((prevTodo)=>({
      ...prevTodo,
            [name]:value
               }));}
  const handleBtnClick=()=>{
    
    fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json"
        }
      })
      
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.log("error fetching data  ", error);
          });
      }
  
  return(
    <>
    <div className="todo-form-container">
        <input className="input-field" type="text" name= "title" placeholder="Title"onChange={handleInputChange} ></input><br></br>
        <input className="input-field" type="text" name="description" placeholder="Description" onChange={handleInputChange}></input>
        <button className="submit-button" onClick={handleBtnClick}>create new todo</button>
      </div>
    </>
  )

}
export default CreateNewTodo;