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
    this.todoList = [];
  }

  clear() {
    this.todoList = [];
  }

  get(indexOfTodo) {
    if (indexOfTodo >= this.todoList.length) return "Index OutOfBound";
    return this.todoList[indexOfTodo];
  }
  getAll() {
    return this.todoList;
  }
  update(index, updateTodo) {
    if (index > this.todoList.length) return "Index OutOfBound";
    this.todoList[index] = updateTodo;
  }
  remove(index) {
    return this.todoList.splice(index, 1);
  }
  add(item) {
    this.todoList.push(item);
  }
}

module.exports = Todo;
