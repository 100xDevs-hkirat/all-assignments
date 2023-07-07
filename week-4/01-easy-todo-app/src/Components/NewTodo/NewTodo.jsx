import FormTodo from "./TodoForm";

const NewTodo = (props) => {
  const todoDataHandler = (entertedTodoData) => {
    const todo = {
      ...entertedTodoData,
      id : Math.floor(Math.random() * 100000)
    }

    props.onSaveNewTodoData(todo);
  }
  return (
    <div>
      <FormTodo onSaveTodoData={todoDataHandler} />
    </div>
  );
};

export default NewTodo;
