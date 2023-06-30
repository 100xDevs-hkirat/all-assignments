import { AuthRole, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import jwt, { Secret } from "jsonwebtoken";

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
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET
        );

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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError("Username and password are required", 400);
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      throw new CustomError("Invalid password", 400);
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET
      ),
    });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      price,
      imageLink,
      published,
    }: {
      title: string;
      description: string;
      price: number;
      imageLink: string;
      published?: boolean;
    } = req.body;

    if (!title || !description) {
      throw new CustomError("Title and description are required", 400);
    }

    const prisma = new PrismaClient();
    const course = await prisma.course.create({
      data: {
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: Boolean(published),
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      courseId: course.id,
    });
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = new PrismaClient();
    const courses = await prisma.course.findMany({});
    res.status(200).json({
      courses,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const updatedCourse = req.body;

    if (!courseId) {
      throw new CustomError("Course ID is required", 400);
    }

    const prisma = new PrismaClient();
    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...updatedCourse,
      },
    });

    res.status(200).json({
      message: "Course updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { signup, login, createCourse, getCourses, updateCourse };
