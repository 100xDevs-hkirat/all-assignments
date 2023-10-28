import React, { useEffect, useState } from 'react'
import axios from 'axios';
import TodoCard from '../components/TodoCard';
import styles from './styles.module.css';

export default function Todo() {
	const [todos, setTodos] = useState([]);
	const refreshTodos = () => {
		axios.get('http://localhost:3000/todos').then((data) => {
			setTodos(data.data);
		});
	}
	useEffect(() => {
		refreshTodos();
	}, []);

	const addTodo = (e) => {
		const title = document.getElementById('title').value;
		const description = document.getElementById('description').value;
		axios.post('http://localhost:3000/todos', {
			"title": title,
			"completed": false,
			"description": description
		}).then((data) => {
			refreshTodos();
			document.getElementById('title').value = '';
			document.getElementById('description').value = '';
		});
	}
	return (
		<div className={styles.todoPage}>
			<div className={styles.todoApp}>
				<h2>Todo App</h2>
				<div className={styles.todoHeaderInput}>
					<div className={styles.todoInput}>
						<input type='text' placeholder='Todo Title' id='title' />
						<input type='text' placeholder='Todo Description' id='description' />
					</div>
					<button className={styles.todoButton} type='submit' onClick={addTodo}>Add</button>
				</div>
				<div  className={styles.todoBody}>
					{todos.map((todo) => {
						return <TodoCard key={todo.id} id={todo.id} title={todo.title} description={todo.description} refreshTodos={refreshTodos}/>
					})}
				</div>
			</div>
		</div>
	)
}

