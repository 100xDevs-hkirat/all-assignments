
export interface InputUser {
  username: string;
  password: string;
}

export interface UserToken {
  message: string;
  token?: string;
}

export interface UserMe {
  username?: string;
  message?: string;
}

export interface CreateTodoItem {
  title: string;
  description: string;
}

export interface TodoItem {
  id: string;
  title?: string;
  description?: string;
  done?: boolean;
}