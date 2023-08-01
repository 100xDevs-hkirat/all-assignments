
import {mongoose} from "mongoose";

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

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);


export default {
    User,
    Todo
}