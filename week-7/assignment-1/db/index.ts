
import mongoose from "mongoose";

interface User {
    _id: string;
    username: string;
    password: string;
  }

  interface Todo {
    _id: string;
    title: string;
    description: string;
    done: boolean;
    userId: string;
  }

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    done: Boolean,
    userId: String,
});

export const User = mongoose.model('User', userSchema);
export const Todo = mongoose.model('Todo', todoSchema);


