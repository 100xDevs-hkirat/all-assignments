import express from "express"
const app = express()
import mongoose from "mongoose"
const port = 3000
import authRoutes from "./routes/auth"
import todoRoutes from "./routes/todo"
import cors from "cors"
require("dotenv").config()

const MONGO_URL = process.env.MONGO_URL || "fallback-url"

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/todo", todoRoutes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect(MONGO_URL, { dbName: "TSCourses" })
