/* eslint-disable react/prop-types */
import './TodoList.css'
const TodoList = ({ id, title, description, onDelete }) => {
    return (
        <div className="list-container">
            <h2 className="list-title">{title}</h2>
            <p className="list-description">{description}</p>
            <button className="delete-button" onClick={() => onDelete(id)}>Delete</button>
        </div>
    )
}

export default TodoList