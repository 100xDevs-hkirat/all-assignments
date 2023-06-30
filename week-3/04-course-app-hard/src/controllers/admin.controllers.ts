import { AuthRole, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import jwt, { Secret } from 'jsonwebtoken';

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError("Username and password are required", 400);
    }
    const prisma = new PrismaClient();

    const userExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userExists) {
      throw new CustomError("Username already exists", 400);
    }


    const hashedPassword = await hash(password, Number(SALT_ROUNDS));
    prisma.user
      .create({
        data: {
          username: username,
          password: hashedPassword,
          role: AuthRole.ADMIN,
        },
      })
      .then((user) => {
        const { id, username, role } = user;
        const token = jwt.sign({ id, username, role }, JWT_SECRET,)

        res.status(201).json({
          message: "User created successfully",
          token,
        });
      })
      .catch((error) => {
        throw new CustomError(error, 500);
      });
  } catch (error) {
    next(error);
  }
};

export { signup };
