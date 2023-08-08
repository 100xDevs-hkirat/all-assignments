import express from "express";
const router = express();
import {
  signup,
  login,
  createCourse,
  updateCourse,
  getCourses,
} from "../controllers/admin.controllers";
import isAdmin from "../middlewares/isAdmin";
import isAuthorized from "../middlewares/isAuthorized";

// Admin routes
router.post("/signup", signup);

router.post("/login", login);

router.post("/courses", isAuthorized, isAdmin, createCourse);

router.put("/courses/:courseId", isAuthorized, isAdmin, updateCourse);

router.get("/courses", isAuthorized, isAdmin, getCourses);

export default router;
