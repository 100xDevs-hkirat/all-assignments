import React from 'react'

function Todo({ todos }) {
  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.description}</span>
        </div>
      ))}
    </>
  );
}


export default Todo
