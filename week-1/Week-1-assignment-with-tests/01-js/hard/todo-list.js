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
    console.log(this.todos);
  }

  remove(index) {
    this.todos.splice(index, 1);
    console.log(this.todos);
  }

  update(index, updatedTodo) {
    if (index > this.todos.length - 1) return;
    this.todos.splice(index, 1, updatedTodo);
    console.log(this.todos);
  }

  getAll() {
    return this.todos;
  }

  get(index) {
    if (index > this.todos.length - 1) return null;
    console.log(this.todos[index]);
    return this.todos[index];
  }

  clear() {
    this.todos = [];
    console.log(this.todos);
  }
}

const todo = new Todo();

todo.add("task1");
todo.add("task2");
todo.add("task3");

todo.remove(1);
todo.update(1, "task6");

todo.getAll();
todo.get(1);
todo.clear();
module.exports = Todo;
