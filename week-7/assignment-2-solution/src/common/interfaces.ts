export interface ITodo {
  title: string
  description: string
  _id: string
  done: boolean
}
export interface LoginRequest {
  username: string
  password: string
}
export interface LoginResponse {
  token: string
  message: string
}
export interface SignupResponse extends LoginResponse {}

export interface SignupRequest extends LoginRequest {}
