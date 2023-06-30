import express from "express";
const router = express();
import * as adminControllers from "../controllers/admin.controllers";
import isAdmin from "../middlewares/isAdmin";
import isAuthorized from "../middlewares/isAuthorized";

// Admin routes
router.post("/signup", adminControllers.signup);

router.post("/login", adminControllers.login);

router.post("/courses", isAuthorized, isAdmin, adminControllers.createCourse);

router.put(
  "/courses/:courseId",
  isAuthorized,
  isAdmin,
  adminControllers.updateCourse
);

router.get("/courses", isAuthorized, isAdmin, adminControllers.getCourses);

export default router;
