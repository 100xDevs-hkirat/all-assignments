import express from "express";
const app = express();
import mongoose  from "mongoose";
const port = 3000;
import authRoutes from "./routes/auth";
import todoRoutes  from "./routes/todo";
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Example app runig ag Port:${port}`);
});

mongoose.connect(
  "mongodb+srv://niharHegde:niharhegde123@cluster0.mfeac2d.mongodb.net/todos",
  {dbName:"todos"
  }
);
