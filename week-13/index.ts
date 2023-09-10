import express from "express";

import authroute from "./routes/authroute";
import todoroute from "./routes/todoroute";
import cors from "cors";

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/auth",authroute);
app.use("/todo",todoroute);

app.listen(port,()=>{
    console.log(`Server is running at localhost:${port}.`);
});