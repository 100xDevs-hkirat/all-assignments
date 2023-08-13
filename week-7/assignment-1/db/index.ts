import mongoose from "mongoose";
import { z } from "zod";

export const TodoValid = z.object({
    title: z.string().min(5),
    description: z.string().min(3),
});

export const UserValidation = z.object({
    username: z.string().min(2),
    password: z.string().min(2),
})
export type UserInterface = z.infer<typeof UserValidation>

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

export {
    User,
    Todo
}