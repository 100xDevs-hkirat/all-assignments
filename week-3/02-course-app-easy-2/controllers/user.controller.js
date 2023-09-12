const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Course = require("../models/course.model");

const userSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User created successfully' });  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      throw new Error("Please provide username and password");
    }
    
    const user = await User.findOne({ username }).select("+password");
    const invalidCredentialsMsg = "Invalid username or password";
    if (!user) throw new Error(invalidCredentialsMsg);
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error(invalidCredentialsMsg);

    const jwtsecret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ id: user._id }, jwtsecret, { expiresIn: "1h" });
    res.status(200).json({ message: 'Logged in successfully', token });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.published) throw new Error("Course not found");
    req.user.purchasedCourses.push(courseId);
    await req.user.save();
    res.status(200).json({ message: 'Course purchased successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPurchasedCourses = async (req, res) => {
  try {
    const userWithCoursesPopulated = await User.findById(req.user._id).populate('purchasedCourses');
    res.status(200).json({ purchasedCourses: userWithCoursesPopulated });
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}

module.exports = {
  userLogin,
  userSignup,
  purchaseCourse,
  getPurchasedCourses
};
