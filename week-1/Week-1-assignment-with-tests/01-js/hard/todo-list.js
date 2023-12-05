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

class Todo{
  constructor(){
    this.todos=[];
  }
  add(todo){
    this.todo.push(todos);
  }
  remove(indexOfTodo){
    if(indexOfTodo>=0 && indexOfTodo<this.todos.length){
      this.todos.slice(indexOfTodo,1);
    }
    else{
      console.error('Invalid index set for removing');
    }
  }

  update(index,updatedTodo){
    if(index>=0 && index<this.todos.length){
      this.todos[index]=updatedTodo;
    }
    else{
      console.error('invalid index to update');
    }
  }

  getAll(){
    return this.todos;
  }

  get(indexOfTodo){
    if(indexOfTodo>=0 && indexOfTodo<this.todos.length){
      return this.todos[indexOfTodo];
    }else{
      console.error('Invalid index provided for retrival');
      return null;
    }

  }

  clear(){
    this.todos=[];
  }
}

const myTodoList = new Todo();

myTodoList.add('Task 1');
myTodoList.add('Task 2');
myTodoList.add('Task 3');

console.log('All Todos:', myTodoList.getAll());

myTodoList.remove(1);
console.log('After removing at index 1:', myTodoList.getAll());

myTodoList.update(0, 'Updated Task 1');
console.log('After updating at index 0:', myTodoList.getAll());

console.log('Task at index 0:', myTodoList.get(0));

myTodoList.clear();
console.log('After clearing all todos:', myTodoList.getAll());

module.exports = Todo;
