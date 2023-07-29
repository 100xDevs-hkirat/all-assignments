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
    constructor(){
        this.todoList = []
    }
    add(todo){
        this.todoList.push(todo);
    }
    remove(idx){
        if(this.todoList[idx])
            this.todoList.splice(idx,1);
    }
    update(idx,todo){
        if(this.todoList[idx])
            this.todoList[idx] = todo;
    }
    getAll(){
        return this.todoList;
    }
    get(idx){
        if(this.todoList[idx])
            return this.todoList[idx];
        else return null;
    }
    clear(){
        this.todoList = [];
    }
}

module.exports = Todo;
