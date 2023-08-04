import express from "express";

const router = express.Router();

router.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  // try {
  //   let response = await Admin.create(req.body);
  //   let token = generatejwt(response);
  //   return res.status(201).json({
  //     message: "Admin created successfully",
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

router.post("/admin/login", async (req, res) => {
  // logic to log in admin
  // try {
  //   let filter = {
  //     username: req.headers.username,
  //     password: req.headers.password,
  //   };
  //   let response = await Admin.findOne(filter);
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

router.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  // try {
  //   let response = await Course.create(req.body);
  //   return res.status(201).json({
  //     message: "Course created successfully",
  //     success: true,
  //     courseId: response.id,
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

router.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  // try {
  //   let courseId = req.params.courseId;
  //   let response = await Course.findByIdAndUpdate(courseId, req.body);
  //   return res.status(200).json({
  //     message: "Course updated successfully",
  //     success: true,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(403).json({
  //     message: "Something went wrong",
  //     success: false,
  //     err: error,
  //   });
  // }
});

router.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
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

export default router;
