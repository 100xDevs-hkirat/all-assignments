import React from 'react'
import styles from './styles.module.css';
import axios from 'axios';

const TodoCard = (props) => {
    const deleteTodo = () => {
        console.log('deleting')
        axios.delete(`http://localhost:3000/todos/${props.id}`).then(resp=>{
            console.log(resp)
        }).catch(err=>{
            console.log(err);
        })
        props.refreshTodos();
    }
    return (
        <div className={styles.todoCard}>
            <div>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.description}>{props.description}</div>
            </div>
            <div onClick={deleteTodo}>
                X
            </div>
        </div>
    )
}

export default TodoCard
