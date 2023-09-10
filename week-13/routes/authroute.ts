import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/authenticate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
      res.json({ message: "User created successfully.", token: token });
    } else {
      res.json({ error: "Error while creating the user." });
    }
  } catch (error) {
    res.json({ error: "Error while signup." });
    console.error("Error:", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });

    if (user) {
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
      res.json({ message: "User login successfully.", token: token });
    } else {
      res.json({ error: "Failed to login." });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  try {
    const userId = parseInt(req.headers.userId as string, 10);
    if (!isNaN(userId)) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if(user)
      { 
        res.json({user});
      }
    } else {
      res.json({ error: "Failed to get the data." });
      console.error("Not get the userId from the jwt.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

export default router;
