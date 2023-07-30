import axios from 'axios';
import React from 'react';

function Todo(props) {
  const { title, description, id, deleteTodo } = props;
  // const deleteTodo = () => {
  //   axios
  //     .delete(`http://localhost:3000/todos:${id}`)
  //     .then((response) => {
  //       console.log(`Deleted post with ID ${id}`);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <div>
      {title}
      <br />
      {description}
      <br />
      <button onClick={() => deleteTodo()}>X</button>
    </div>
  );
}

export default Todo;
