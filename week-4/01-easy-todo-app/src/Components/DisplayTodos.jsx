import React from "react";

export default function DisplayTodos({ todos, setTodos, client }) {
  const handleDelete = (e) => {
    client
      .delete(`/todos/${e.target.parentElement.id}`)
      .then((response) => {
        setTodos(
          todos.filter(
            (todo) => todo.id !== parseInt(e.target.parentElement.id)
          )
        );
      })
      .catch((err) => console.log(err));
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
