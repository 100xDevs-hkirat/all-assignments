import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { compare, hash } from "bcrypt";
import { AuthRole, PrismaClient } from "@prisma/client";
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
          role: AuthRole.USER,
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

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = new PrismaClient();
    const courses = await prisma.course.findMany({
      where: {
        published: true,
      },
    });

    res.status(200).json({
      courses,
    });
  } catch (error) {
    next(error);
  }
};

const purchaseCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not found", 404);
    }

    const prisma = new PrismaClient();
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new CustomError("Course not found", 404);
    }

    if (course.published === false) {
      throw new CustomError("Course not published", 400);
    }

    const purchase = await prisma.purchase.findFirst({
        where: {
            userId: userId,
            courseId: courseId
        }
    })

    if (purchase) {
        throw new CustomError("Course already purchased", 400);
    }


    await prisma.purchase.create({
      data: {
        userId: userId,
        courseId: courseId,
      },
    });

    res.status(200).json({
      message: "Course purchased successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPurchasedCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const prisma = new PrismaClient();

    if (!userId) {
      throw new CustomError("User not found", 404);
    }

    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: true,
      },
    });

    res.status(200).json({
      purchasedCourses,
    });
  } catch (error) {
    next(error);
  }
};

export { signup, login, getCourses, purchaseCourse, getPurchasedCourses };
