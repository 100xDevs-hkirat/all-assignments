import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { Todo } from "./todo";
import { TodoCreationParams, TodoService } from "./todoServices";

// ROUTE -> /todo/:todoId

@Route("todo")
export class TodoController extends Controller {
  @Get("{todoId}")
  public async getTodo(@Path() todoId: string): Promise<Todo> {
    let todoService = new TodoService();
    return todoService.get(todoId);
  }

  @Post("{todoName}")
  public async createTodo(@Path() todoName: string): Promise<Todo> {
    let todoService = new TodoService();
    return todoService.create({ title: todoName, description: todoName });
  }
}
