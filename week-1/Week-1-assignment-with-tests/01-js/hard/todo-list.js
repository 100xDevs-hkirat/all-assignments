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

  add = (todo) => {
    this.todoList.push(todo);
  };
  remove = (indexOfTodo) => {
    this.todoList.splice(indexOfTodo, 1);
  };
  update = (index, todo) => {
    if (index >= this.todoList.length) return null;
    this.todoList[index] = todo;
  };
  getAll = () => this.todoList;
  get = (index) => {
    if (index >= this.todoList.length) return null;
    return this.todoList[index];
  };
  clear = () => (this.todoList.length = 0);
}

module.exports = Todo;
