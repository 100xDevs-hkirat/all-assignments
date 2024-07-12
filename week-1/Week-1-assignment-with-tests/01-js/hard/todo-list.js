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
  add(addEle) {
    this.todoList = [...this.todoList, addEle];
  }
  remove(popInIndex) {
    // if (popInIndex >= this.todoList.length) {
    //   throw (Error);
    // } else {
    this.todoList = this.todoList.slice(0, popInIndex).concat(this.todoList.slice(popInIndex + 1, this.todoList.length));
    // }
  }

  update(popInIndex, ele) {
    // if (popInIndex < 0 || popInIndex >= this.todoList.length) {
    //   throw (Error);
    // } else {

    this.todoList[popInIndex] = ele;

    // }
  }

  getAll() {
    return this.todoList;
  }

  get(indexOfTodo) {
    // if (popInIndex < 0 || popInIndex >= this.todoList.length) {
    //   throw (Error);
    // } else {
    return this.todoList[indexOfTodo + 1];



    // }

  }
  clear() {
    this.todoList = [];
    return this.todoList;

  }
}

module.exports = Todo;
