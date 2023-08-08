import { NextFunction, Request, Response } from "express";
import { CustomError } from "./errorHandler.middleware";
import jwt, { Secret } from "jsonwebtoken";
import { AuthRole, PrismaClient } from "@prisma/client";

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

const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const prisma = new PrismaClient();
    const userExist = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExist) {
      throw new CustomError("User not found", 404);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthorized;
