import express from "express";
const router = express();

// User routes
router.post("/users/signup", (req, res) => {
  // logic to sign up user
});

router.post("/users/login", (req, res) => {
  // logic to log in user
});

router.get("/users/courses", (req, res) => {
  // logic to list all courses
});

router.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

router.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

export default router;
