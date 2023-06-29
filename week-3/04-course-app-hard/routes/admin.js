const express = require("express");
const { body, header } = require("express-validator");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Course = require("../models/course");

const validateRequest = require("../middlewares/validate-request");
const { authorise, authenticateAdmin } = require("../middlewares/auth-handler");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

const router = express.Router();

router.post(
  "/admin/signup",
  [
    body("username")
      .isLength({ min: 1, max: 20 })
      .withMessage("Please enter a username, max 20 characters"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters long"),
  ],
  validateRequest,
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const adminExists = await Admin.findOne({ username });
      if (adminExists) {
        throw new BadRequestError("Admin exists with given username");
      }
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();

      let tokenData = {
        time: new Date(),
        userId: newAdmin._id,
      };
      let token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY);

      return res.status(201).json({
        message: "Admin created successfully",
        token: token,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestError(err.message);
    }
  }
);

router.post(
  "/admin/login",
  [
    header("username").exists().withMessage("Please enter a valid username"),
    header("password").exists().withMessage("Please enter a password"),
  ],
  validateRequest,
  async (req, res) => {
    // logic to log in user
    try {
      const username = req.get("username");
      const password = req.get("password");

      const admin = await Admin.findOne({ username });
      if (!admin) {
        throw new BadRequestError("admin does not exist");
      }
      console.log(password);
      let isPasswordCorrect = await admin.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new BadRequestError("Incorrect username/password");
      }

      let tokenData = {
        time: new Date(),
        userId: admin._id,
      };
      let token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY);

      return res.status(200).json({
        message: "Logged in successfully",
        token: token,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestError(err.message);
    }
  }
);

router.post(
  "/admin/courses",
  [
    body("title")
      .isLength({ min: 1, max: 50 })
      .withMessage("Please enter a valid course title, max 50 characters"),
    body("description").exists().withMessage("Please enter a description"),
    body("price").isNumeric().withMessage("Please enter a valid number"),
    body("imageLink").exists().withMessage("Please enter an image link"),
    body("published").isBoolean().withMessage("Please enter a boolean value"),
  ],
  validateRequest,
  authorise,
  authenticateAdmin,
  async (req, res) => {
    // logic to create a course
    try {
      let { title, description, price, imageLink, published } = req.body;
      if (published == undefined) published = false;

      const newCourse = new Course({
        title,
        description,
        price,
        imageLink,
        published,
      });

      await newCourse.save();

      return res.status(201).json({
        message: "Course created successfully",
        courseId: newCourse._id,
      });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

router.put(
  "/admin/courses/:courseId",
  [
    body("title")
      .isLength({ min: 1, max: 50 })
      .withMessage("Please enter a valid course title, max 50 characters"),
    body("description").exists().withMessage("Please enter a description"),
    body("price").isNumeric().withMessage("Please enter a valid number"),
    body("imageLink").exists().withMessage("Please enter an image link"),
    body("published").isBoolean().withMessage("Please enter a boolean value"),
  ],
  validateRequest,
  authorise,
  authenticateAdmin,
  async (req, res) => {
    // logic to edit a course
    const courseId = req.params.courseId;
    let { title, description, price, imageLink, published } = req.body;
    try {
      const course = await Course.findById(courseId).exec();
      if (!course) {
        throw new BadRequestError("Course with given id does not exist");
      }

      let updatedCourse = {
        title,
        description,
        price,
        imageLink,
        published,
      };

      await Course.findOneAndUpdate({ _id: courseId }, updatedCourse).exec();

      return res.status(200).json({ message: "Course updated successfully" });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

router.get("/admin/courses", async (req, res) => {
  // logic to get all courses
  try {
    const courses = await Course.find({}).exec();

    return res.status(200).json({ courses });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

module.exports = router;
