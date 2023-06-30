import express, { json } from "express";
import adminRoutes from "./src/routes/admin.routes";
import userRoutes from "./src/routes/user.routes";
import {errorHandler} from "./src/middlewares/errorHandler.middleware";


const app = express();
app.use(json());

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
