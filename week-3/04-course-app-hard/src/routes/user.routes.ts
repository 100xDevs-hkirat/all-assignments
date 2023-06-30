import express from "express";
const router = express();
import {
  login,
  signup,
  getCourses,
  purchaseCourse,
  getPurchasedCourses,
} from "../controllers/user.controllers";
import isAuthorized from "../middlewares/isAuthorized";

// User routes
router.post("/signup", signup);

router.post("/login", login);

router.get("/courses", isAuthorized, getCourses);

router.post("/courses/:courseId", isAuthorized, purchaseCourse);

router.get("/purchasedCourses", isAuthorized, getPurchasedCourses);

export default router;
