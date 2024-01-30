import { Todo } from "./todo";

export type TodoCreationParams = Pick<Todo, "title" | "description">;

export class TodoService {
  public get(todoId: string): Todo {
    return {
      id: todoId,
      title: "Mocked Todo",
      description: "Mocked Todo",
      done: false,
    };
  }

  public create(todoCreationParams: TodoCreationParams): Todo {
    return {
      id: "2",
      title: todoCreationParams?.title || "Title New",
      description: todoCreationParams?.description || "description New",
      done: false,
    };
  }
}
