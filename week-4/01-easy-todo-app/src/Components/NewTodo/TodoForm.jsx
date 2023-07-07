import { useState } from "react";
import "./TodoForm.css";

const TodoForm = (props) => {
  const [addTodo , setAddTodo] = useState('');

  function addTodoHandler(event){
    setAddTodo(event.target.value);
  }

  function SubmitHandler(event){
    event.preventDefault();
    const todo = {
      title : addTodo,
      createdAt : new Date().toString()
    }
    props.onSaveTodoData(todo);
    setAddTodo('');
  }



  return (
    <div className="form-todo">
      <h2 className="title">Add_New_Todo</h2>
      <form onSubmit={SubmitHandler}>
        <input placeholder="Add_Todo" value={addTodo} type="text" required onChange={addTodoHandler} />
        {/* <input placeholder="Add Description" type="text" required /> */}
        <button type="submit" className="btn">
          Add_Todo
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
