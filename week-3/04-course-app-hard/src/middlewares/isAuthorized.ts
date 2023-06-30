import { NextFunction, Request, Response } from "express";
import { CustomError } from "./errorHandler.middleware";
import jwt, { Secret } from "jsonwebtoken";
import { AuthRole } from "@prisma/client";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";

declare module "express" {
  interface Request {
    user?: User;
  }
}

interface User {
  id: string;
  username: string;
  role: AuthRole;
}

const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new CustomError(
        "You are not authorized to perform this action",
        403
      );
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = decodedToken as User;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthorized;
