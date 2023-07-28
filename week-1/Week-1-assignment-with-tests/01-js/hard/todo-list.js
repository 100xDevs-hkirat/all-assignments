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
    this.todos = []
  }

  add(taskToAdd) {
    this.todos.push(taskToAdd)
  }

  remove(taskIndex) {
    if (taskIndex >= 0 && taskIndex < this.todos.length) {
      this.todos.splice(taskIndex, 1);
    };
  }

  update(taskIndex, updatedTask) {
    if (taskIndex >= 0 && taskIndex < this.todos.length) {
      this.todos.splice(taskIndex, 1, updatedTask);
    }
  }

  getAll() {
    return this.todos;
  }

  get(taskIndex) {
    if (taskIndex >= 0 && taskIndex < this.todos.length) {
      return this.todos[taskIndex];
    }
    return null;
  }

  clear() {
    this.todos = []
  }
}

module.exports = Todo;
