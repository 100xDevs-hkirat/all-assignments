import React from "react";

export default function DisplayTodos({ todos, setTodos }) {
  const handleDelete = (e) => {
    fetch("http://localhost:3000/todos/" + e.target.parentElement.id, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        console.log("Todo Deleted!");
        setTodos(
          todos.filter(
            (todo) => todo.id !== parseInt(e.target.parentElement.id)
          )
        );
      } else {
        console.log("Some error deleting todo..");
      }
    });
  };

  return (
    <>
      <h1 className="heading">TASKS</h1>
      <section className="list" id="list">
        {todos.map((todo) => {
          return (
            <div className="each-task" id={todo.id}>
              <h2>{todo.title}</h2>
              <p>{todo.description}</p>
              <i className="fa fa-trash" onClick={handleDelete}></i>
            </div>
          );
        })}
      </section>
    </>
  );
}
