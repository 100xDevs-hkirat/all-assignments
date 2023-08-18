const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const e = require("express");

app.use(express.json());

const SECRET = "mySecret";

//Mongoose Schemas

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
	username: String,
	password: String,
});

const courseSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	imageLink: String,
	published: Boolean,
});

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

//Mongoose Models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const authenticateJwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, SECRET, (err, user) => {
			if (err) {
				res.status(401).json({ message: "Authentication Failed" });
			} else {
				req.user = user;
				next();
			}
		});
	} else {
		res.status(403).json({ message: "authorization invalid" });
	}
};

mongoose.connect(
	"mongodb+srv://devanshuchi9:Devanshu09*&@devanshu.xthjosp.mongodb.net/",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "EduVerse",
	}
);

// Admin routes
app.post("/admin/signup", async (req, res) => {
	// logic to sign up admin
	const { username, password } = req.body;
	const admin = await Admin.findOne({ username });
	if (admin) {
		res.status(403).json({ message: "Admin already exists!" });
	} else {
		const obj = { username: username, password: password };
		const newAdmin = new Admin(obj);
		newAdmin.save();
		const token = jwt.sign({ username, role: "Admin" }, SECRET, {
			expiresIn: "1hr",
		});
		res.json({ message: "Admin Created Successfully!", token });
	}
});

app.post("/admin/login", async (req, res) => {
	// logic to log in adminconst { username, password } = req.body;
	const { username, password } = req.headers;
	const admin = await Admin.findOne({ username, password });
	if (admin) {
		const token = jwt.sign({ username, role: "admin" }, SECRET, {
			expiresIn: "1h",
		});
		res.json({ message: "Logged in successfully", token });
	} else {
		res.status(404).json({ message: "Admin not found" });
	}
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
	// logic to create a course
	const course = new Course(req.body);
	await course.save();
	res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
	// logic to edit a course
	const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
		new: true,
	});
	if (course) {
		res.json({ message: "Course updated successfully." });
	} else {
		res.status(404).json({ message: "Course Not Found!" });
	}
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
	// logic to get all courses
	const courses = await Course.find({});
	res.json(courses);
});

// User routes
app.post("/users/signup", async (req, res) => {
	// logic to sign up user
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (user) {
		res.status(403).json({ message: "User already exists" });
	} else {
		const obj = { username: username, password: password };
		const newUser = new User(obj);
		await newUser.save();
		const token = jwt.sign({ username, role: "User" }, SECRET, {
			expiresIn: "1hr",
		});
		res.json({ message: "User created successfully.", token });
	}
});

app.post("/users/login", async (req, res) => {
	// logic to log in user
	const { username, password } = req.headers;
	const user = await User.findOne({ username, password });
	if (user) {
		const token = jwt.sign({ username, role: "User" }, SECRET, {
			expiresIn: "1hr",
		});
		res.json({ message: "User Logged in successfully" });
	} else {
		res.status(403).json({ message: "Invalid username or password!" });
	}
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
	// logic to list all courses
	const courses = await Course.find({ published: true });
	res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
	// logic to purchase a course
	const course = await Course.findById(req.params.courseId);
	if (course) {
		const user = await User.findOne({ username: req.user.username });
		if (user) {
			user.purchasedCourses.push(course);
			await user.save();
			res.json({ message: "Course purchased successfully" });
		} else {
			res.status(403).json({ message: "User not found" });
		}
	} else {
		res.status(404).json({ message: "Course not found" });
	}
});

app.get("/users/purchasedCourses", async (req, res) => {
	// logic to view purchased courses
	const user = await User.findOne({ username: req.user.username }).populate(
		"purchasedCourses"
	);
	if (user) {
		res.json({ purchasedCourses: user.purchasedCourses || [] });
	} else {
		res.status(403).json({ message: "User not found" });
	}
});

app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
