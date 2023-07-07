import TodoItem from "./TodoItem"
import './Todos.css'

const Todos = (props) => {

    const deleteHandler = (deletedTodo) => {
        props.onDeleteHandler(deletedTodo)
    }
    return <div className="todos">
        
        {props.todos == 0 && <div className="not-found"><h2>No todos are found.</h2></div>}
        {props.todos.map(todo => 
            (<TodoItem todo={todo} key={todo.id} onDeleteHandler={deleteHandler} />
        ))}

    </div>
}

export default Todos;