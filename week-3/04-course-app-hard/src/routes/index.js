import express from "express";

import admin from "./admin/index.js";
import user from "./user/index.js";

const router = express.Router();

router.use("/admin", admin);
router.use("/user", user);

export default router;
