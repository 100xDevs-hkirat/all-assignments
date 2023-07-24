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
  add(todo) {  // works fine
    this.todos.push(todo);
  }
  remove(index){
    this.todos.splice(index,1);
  }
  update(index, updatedTodo){
    if(index>=0 && index < this.todos.length)
    this.todos[index] = updatedTodo;
  }
  getAll(){  // works fine
    return this.todos;
  }
  get(index){
    if(index>=0 && index < this.todos.length)
    return this.todos[index];
    else return null;
  }

  clear(){ // WORKS FINE
    this.todos.splice(0,this.todos.length);
  }
}

module.exports = Todo;
