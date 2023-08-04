import express from "express";

const router = express.Router();

// User routes
router.post("/users/signup", async (req, res) => {
  // logic to sign up user
  // try {
  //   let response = await User.create(req.body);
  //   let token = generatejwt(response);
  //   return res.status(201).json({
  //     message: "User created successfully",
  //     success: true,
  //     err: {},
  //     token: token,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(403).json({
  //     message: "Soemthing went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

router.post("/users/login", async (req, res) => {
  // logic to log in user
  // try {
  //   let filter = {
  //     username: req.headers.username,
  //     password: req.headers.password,
  //   };
  //   let response = await User.findOne(filter);
  //   let token = generatejwt(response);
  //   return res.status(201).json({
  //     message: "Logged in successfully",
  //     success: true,
  //     err: {},
  //     token: token,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(403).json({
  //     message: "Soemthing went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

router.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  // try {
  //   let response = await Course.find({});
  //   return res.status(200).json({
  //     courses: response,
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.status(403).json({
  //     message: "Something went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

router.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course
  // try {
  //   console.log("inside purchase");
  //   let course = await Course.findById(req.params.courseId);
  //   console.log(course);
  //   console.log(req.body.id);
  //   let user = await User.findById(req.user.id);
  //   user.purchasedCourses.push(course);
  //   await user.save();
  //   return res.status(200).json({
  //     message: "course purchased successfully",
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.status(403).json({
  //     message: "Something went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

router.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  // try {
  //   let user = await User.findById(req.user.id);
  //   return res.status(200).json({
  //     purchasedCourses: user.purchasedCourses,
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.status(403).json({
  //     message: "Something went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

export default router;
