import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { todoRouter } from "./routes/todo";
const PORT = 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/todo", todoRouter);
app.use("*", (req, res) => {
    res.status(404).json("hkd;");
});
// module.exports = app;
export default app;
