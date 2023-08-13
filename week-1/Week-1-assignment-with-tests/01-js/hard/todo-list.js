/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
  - `npm run test-todo-list`
*/
class Todo {
  constructor() {
    this.todos = [];
  }

  add(todo) {
    this.todos.push(todo);
  }

  remove(index) {
    this.todos.splice(index, 1); 
  }

  update(index, updatedTodo) {
    this.todos[index] = updatedTodo;
  }

  getAll() {
    return this.todos;
  }

  get(index) {
    return this.todos[index];
  }

  clear() {
    this.todos = [];
  }
}

// Usage:

const todoList = new Todo();

todoList.add('Buy groceries'); 
todoList.add('Go to gym');

todoList.update(1, 'Go for a run');

console.log(todoList.getAll()); 

todoList.remove(0); 

console.log(todoList.get(0)); 

todoList.clear();

console.log(todoList.getAll()); 

module.exports = Todo;
