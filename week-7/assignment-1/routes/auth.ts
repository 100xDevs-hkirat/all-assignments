import jwt from "jsonwebtoken"
import express from "express"
import { authenticateJwt, SECRET } from "../middleware/"
import { User } from "../db"
import { z } from "zod"
const router = express.Router()

const emailSchema = z.string().email("Invalid email format")
const passwordSchema = z
    .string()
    .min(8, "Password should be atleast 8 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/u, "Must contain letters and numbers")

router.post("/signup", async (req, res) => {
    const { username, password } = req.body

    try {
        const validEmail = emailSchema.parse(username)
        const validPassword = passwordSchema.parse(password)

        console.log(validEmail) //remove later
        console.log(validPassword) //remove later

        const user = await User.findOne({ validEmail })
        if (user) {
            res.status(403).json({ message: "User already exists" })
        } else {
            const newUser = new User({ username: validEmail, password: validPassword })
            console.log(newUser) //remove later
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" })
            res.json({ message: "User created successfully", token })
        }
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errorMessage = e.errors[0].message
            res.status(400).json({ message: errorMessage })
        } else {
            res.status(400).json({ message: "Signup failed" })
        }
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    if (user) {
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" })
        res.json({ message: "Logged in successfully", token })
    } else {
        res.status(403).json({ message: "Invalid username or password" })
    }
})

router.get("/me", authenticateJwt, async (req, res) => {
    const user = await User.findOne({ _id: req.headers["userId"] })
    if (user) {
        res.json({ username: user.username })
    } else {
        res.status(403).json({ message: "User not logged in" })
    }
})

export default router
