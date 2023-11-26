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
    this.todo = [];
  }
  add(_todo) {
    this.todo.push(_todo);
  }
  remove(indexOfTodo) {
    if (indexOfTodo < 0 || indexOfTodo >= this.todo.length) {
      // throw new Error("Invalid Index!");
    } else this.todo.splice(indexOfTodo, 1);
  }
  update(index, updatedTodo) {
    if (index < 0 || index >= this.todo.length) {
      // throw new Error("Invalid Index!");
    } else this.todo[index] = updatedTodo;
  }
  getAll() {
    return this.todo;
  }
  get(indexOfTodo) {
    if (indexOfTodo < 0 || indexOfTodo >= this.todo.length) {
      // throw new Error("Invalid Index!");
      return null;
    } else return this.todo[indexOfTodo];
  }
  clear() {
    this.todo = [];
  }
}
module.exports = Todo;
