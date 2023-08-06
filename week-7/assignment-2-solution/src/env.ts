import { z } from "zod";

const envSchema = z.object({
  VITE_BASE_URL: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const ENV = envSchema.parse(import.meta.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) return result.error.issues;
};
