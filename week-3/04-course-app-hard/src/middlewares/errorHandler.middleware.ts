import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "CustomError";
  }
}

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err,
    message: err.message || "Internal Server Error",
    statusCode: statusCode,
    success: false,
  });
};

export { errorHandler, CustomError };
