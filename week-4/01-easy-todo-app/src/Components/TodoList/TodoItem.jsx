import './TodoItem.css'

const TodoItem = (props) => {


    const deleteHandler = () => {
        props.onDeleteHandler(props.todo)
    }
    
    return <div className='todo-item'>
            <h3 className="todo-item_todo">{props.todo.title}</h3>
            <button onClick={deleteHandler}>Delete</button>
        </div>
        
    
}


export default TodoItem;