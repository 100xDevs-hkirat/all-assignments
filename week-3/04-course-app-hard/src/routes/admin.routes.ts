import express from "express";
const router = express();
import { signup } from "../controllers/admin.controllers";

// Admin routes
router.post("/signup", signup);

router.post("/admin/login", (req, res) => {
  // logic to log in admin
});

router.post("/admin/courses", (req, res) => {
  // logic to create a course
});

router.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
});

router.get("/admin/courses", (req, res) => {
  // logic to get all courses
});

export default router;
