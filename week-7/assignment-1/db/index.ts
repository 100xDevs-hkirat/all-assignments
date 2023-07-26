import mongoose from "mongoose";
import { z } from "zod";

export const userShema1 = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();


const userSchema = new mongoose.Schema(userShema1);

export const todoschema1 = z
  .object({
    title: z.string(),
    description: z.string(),
    done: z.boolean(),
    userId: z.string(),
  })
  .strict();
const todoSchema = new mongoose.Schema(todoschema1);

export const User = mongoose.model("User", userSchema);
export const Todo = mongoose.model("Todo", todoSchema);
