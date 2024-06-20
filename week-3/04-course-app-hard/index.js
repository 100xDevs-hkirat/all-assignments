const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserModel, AdminModel, CourseModel } = require("./models");

app.use(express.json());

const SECRET = "arunchaitanya";

const authenticationMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send("Unauthorized");
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET);
  req.user = user;
  next();
};

const isAdminMiddleware = async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(401).send("Unauthorized");
  }
};

const isUserMiddleware = async (req, res, next) => {
  if (req.user.role === "user") {
    next();
  } else {
    return res.status(401).send("Unauthorized");
  }
};

const userJwt = async (username, userId, isAdmin) => {
  const token = await jwt.sign(
    {
      username,
      userId,
      role: isAdmin ? "admin" : "user",
    },
    SECRET
  );
  return token;
};
// Admin routes
app.post("/admin/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userInDb = await AdminModel.findOne({ username });
    if (userInDb) {
      return res
        .status(401)
        .send("User with this username already have an account");
    }
    if (username && password) {
      const admin = await AdminModel.create({ username, password });
      const token = await userJwt(admin.username, admin._id, true);
      return res
        .status(201)
        .send({ message: "Admin created successfully", token });
    } else {
      return res.status(401).send("please provide correct email and password");
    }
  } catch (e) {
    return res.status(500).send("Something went wrong. Please try again");
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const admin = await AdminModel.findOne({ username, password });
      if (!admin) {
        return res.status(401).send("Unauthorized");
      }
      const token = await userJwt(admin.username, admin._id, true);
      return res.status(200).send({ message: "Logged in successfully", token });
    } else {
      return res.status(401).send("please provide email and password");
    }
  } catch (e) {
    return res.status(500).send("Something went wrong. Please try again");
  }
  // logic to log in admin
});

app.post(
  "/admin/courses",
  authenticationMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const course = await CourseModel.create(req.body);
      return res
        .status(201)
        .send({ message: "Course created successfully", courseId: course._id });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }
  }
);

app.put(
  "/admin/courses/:courseId",
  authenticationMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    const courseId = req.params.courseId;
    try {
      const course = await CourseModel.findByIdAndUpdate(courseId, req.body);
      c;
      return res.status(200).send({ message: "Course updated successfully" });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }
    // logic to edit a course
  }
);

app.get(
  "/admin/courses",
  authenticationMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const courses = await CourseModel.find({});
      return res.status(200).send({ courses });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }
    // logic to get all courses
  }
);

// User routes
app.post("/users/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userInDb = await UserModel.findOne({ username });
    if (userInDb) {
      return res
        .status(401)
        .send("User with this username already have an account");
    }
    if (username && password) {
      const user = await UserModel.create({
        username,
        password,
        purchasedCourses: [],
      });
      const token = await userJwt(user.username, user._id, false);
      return res
        .status(201)
        .send({ message: "User created successfully", token });
    } else {
      return res.status(401).send("please provide correct email and password");
    }
  } catch (e) {
    return res.status(500).send("Something went wrong. Please try again");
  }
  // logic to sign up user
});

app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const user = await UserModel.findOne({ username, password });
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
      const token = await userJwt(user.username, user._id, false);
      return res.status(200).send({ message: "Logged in successfully", token });
    } else {
      return res.status(401).send("please provide email and password");
    }
  } catch (e) {
    return res.status(500).send("Something went wrong. Please try again");
  }
  // logic to log in user
});

app.get(
  "/users/courses",
  authenticationMiddleware,
  isUserMiddleware,
  async (req, res) => {
    try {
      const courses = await CourseModel.find({});
      return res.status(200).send({ courses });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }
  }
  // logic to list all courses
);

app.post(
  "/users/courses/:courseId",
  authenticationMiddleware,
  isUserMiddleware,
  async (req, res) => {
    try {
      const courseId = req.params.courseId;
      if (!course) {
        return res.status(404).send({ message: "No such course exists!" });
      }
      const { userId } = req.user;
      const course = await CourseModel.findById(courseId);
      const user = await UserModel.findById(userId);
      user.purchasedCourses = [...user.purchasedCourses, course];
      console.log(user);
      await user.save();
      return res.status(201).send({ message: "Course purchased successfully" });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }
  }
);

app.get(
  "/users/purchasedCourses",
  authenticationMiddleware,
  isUserMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.user;
      console.log("hihi", userId);
      const user = await UserModel.findById(userId).populate(
        "purchasedCourses"
      );
      return res.status(200).send({ purchasedCourses: user.purchasedCourses });
    } catch (e) {
      return res.status(500).send("Something went wrong. Please try again");
    }

    // logic to view purchased courses
  }
);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://arun:arun@cluster0.djzdzkm.mongodb.net/courses-api?retryWrites=true&w=majority"
    );
    console.log("CONNECTED TO DATABASE");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  } catch (e) {
    console.log(`Error in connecting server: ${e}`);
  }
};

start();
