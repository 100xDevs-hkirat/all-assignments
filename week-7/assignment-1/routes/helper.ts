import { Response } from "express";
import { ZodError, z } from "zod";

export const postTodoInputs = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  userId: z.string().min(1),
});

export const getTodosInput = z.object({
  userId: z.string().min(1),
});

export const updateTodosInput = z.object({
  todoId: z.string().min(1),
});

export const authUserPass = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});

type ValidationResults<T> =
  | { success: true; data: T }
  | { success: false; error: ZodError };

export const handleValidation = <T>(
  parsedInputs: ValidationResults<T>,
  res: Response
): boolean => {
  if (!parsedInputs.success) {
    res.status(406).json({
      error: parsedInputs.error,
    });
    return true;
  }
  return false;
};
