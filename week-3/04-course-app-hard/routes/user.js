const express = require("express");
const { body, header } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Course = require("../models/course");

const validateRequest = require("../middlewares/validate-request");
const { authorise, authenticate } = require("../middlewares/auth-handler");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

const router = express.Router();
// User routes
router.post(
  "/users/signup",
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
      const userExists = await User.findOne({ username });
      if (userExists) {
        throw new BadRequestError("User exists with given username");
      }
      const newUser = new User({ username, password });
      await newUser.save();

      let tokenData = {
        time: new Date(),
        userId: newUser._id,
      };
      let token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY);

      return res.status(201).json({
        message: "User created successfully",
        token: token,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestError(err.message);
    }
  }
);

router.post(
  "/users/login",
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

      const user = await User.findOne({ username });
      if (!user) {
        throw new BadRequestError("User does not exist");
      }

      let isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new BadRequestError("Incorrect username/password");
      }

      let tokenData = {
        time: new Date(),
        userId: user._id,
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

router.get("/users/courses", authorise, authenticate, async (req, res) => {
  // logic to list all courses
  try {
    const courses = await Course.find({}).exec();

    return res.status(200).json({ courses });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

router.post(
  "/users/courses/:courseId",
  authorise,
  authenticate,
  async (req, res) => {
    // logic to purchase a course
    const courseId = req.params.courseId;

    try {
      const course = await Course.findById(courseId).exec();
      if (!course) {
        throw new NotFoundError("Course not found with given courseId ");
      }

      await User.updateOne(
        { _id: req.userId },
        { $push: { courses: courseId } }
      ).exec();

      return res.status(200).json({ message: "Course purchased successfully" });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

router.get(
  "/users/purchasedCourses",
  authorise,
  authenticate,
  async (req, res) => {
    // logic to view purchased courses
    try {
      const user = await User.findById(req.userId);
      const purchasdCourses = await Course.find({
        _id: {
          $in: user.courses,
        },
      }).exec();

      return res.status(200).json({ purchasdCourses });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

module.exports = router;
//xcH5Rwtr18oGVyWA;
