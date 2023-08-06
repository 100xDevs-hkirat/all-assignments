export type UserToken = {
  message: string;
  token?: string;
}

export type UsernameToken = {
  username: string | undefined;
  token: string | undefined;
}

export type Todo = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  userId: string;
}

export type UserMe = {
  username?: string;
  message?: string;
}
