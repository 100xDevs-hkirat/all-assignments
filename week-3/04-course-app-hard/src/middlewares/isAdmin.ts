import { AuthRole } from "@prisma/client";
import { CustomError } from "./errorHandler.middleware";
import { NextFunction, Request, Response } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user?.role !== AuthRole.ADMIN) {
      throw new CustomError(
        "You are not authorized to perform this action",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isAdmin;
