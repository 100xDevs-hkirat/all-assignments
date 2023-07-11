import axios from 'axios';

export function getTodos() {
  return new Promise((res, rej) => {
    axios.get('http://localhost:3000/todos').then(res).catch(rej);
  });
}

export function postTodo(todo) {
  return new Promise((res, rej) => {
    axios.post('http://localhost:3000/todos', todo).then(res).catch(rej);
  });
}

export function putTodo(id, update) {
  return new Promise((res, rej) => {
    axios.put(`http://localhost:3000/todos/${id}`, update).then(res).catch(rej);
  });
}

export function deleteTodo({ id }) {
  return new Promise((res, rej) => {
    axios.delete(`http://localhost:3000/todos/${id}`).then(res).catch(rej);
  });
}
