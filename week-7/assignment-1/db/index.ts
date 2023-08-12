import mongoose from "mongoose";

export interface UserInterface{
    username: string,
    password: string,
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

export interface TodoInterface {
    title: string,
    description: string,
    done: boolean,
    userId: string
}

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    done: Boolean,
    userId: String,
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

export {
    User,
    Todo
}