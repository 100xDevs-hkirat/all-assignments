import mongoose from "mongoose";
import { z } from "zod";

const userSchema = new mongoose.Schema(
  z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .strict()
);

const todoSchema = new mongoose.Schema(
  z
    .object({
      title: z.string(),
      description: z.string(),
      done: z.boolean(),
      userId: z.string(),
    })
    .strict()
);

export const User = mongoose.model("User", userSchema);
export const Todo = mongoose.model("Todo", todoSchema);
