const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
	const { username, password } = req.headers;
	const admin = ADMINS.find(
		(a) => a.username === username && a.password === password
	);
	if (admin) {
		next();
	} else {
		res.status(403).json({ message: "Admin Authentication Failed." });
	}
};

const userAuthentication = (req, res, next) => {
	const { username, password } = req.headers;
	const user = USERS.find(
		(u) => u.username === username && u.password === password
	);
	if (user) {
		req.user = user;
		next();
	} else {
		res.status(403).json({ message: "User Authentication Failed." });
	}
};

// Admin routes
app.post("/admin/signup", (req, res) => {
	// logic to sign up admin
	const admin = req.body;
	const existingAdmin = ADMINS.find((a) => a.username === admin.username);
	if (existingAdmin) {
		res.status(403).json({ message: "Username already exists." });
	} else {
		ADMINS.push(admin);
		res.json({ message: "Admin created successfully." });
	}
});

app.post("/admin/login", adminAuthentication, (req, res) => {
	// logic to log in admin
	res.json({ message: "Admin Logged in Successfully!" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
	// logic to create a course
	const course = req.body;
	course.id = Date.now();
	COURSES.push(course);
	res.json({ message: "Course crated sucessfully.", courseId: course.id });
});

app.put("/admin/courses/:courseId", (req, res) => {
	// logic to edit a course
	const courseId = parseInt(req.params.courseId);
	const course = COURSES.find((c) => c.id === courseId);
	if (!course) {
		res.status(404).json("Course Not Found");
	} else {
		Object.assign(course, req.body);
		res.json({ message: "Course updated successfully" });
	}
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
	// logic to get all courses
	res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
	// logic to sign up user
	const userDummy = req.body;
	existingUser = USERS.find((u) => u.username === userDummy.username);
	if (existingUser) {
		res.status(403).json({ message: "User already exists!" });
	} else {
		const user = {
			username: req.body.username,
			password: req.body.password,
			purchasedCourses: [],
		};
		USERS.push(user);
		res.json({ message: "User created successfully!" });
	}
});

app.get("/users/all", (req, res) => {
	res.json({ users: USERS });
});

app.post("/users/login", userAuthentication, (req, res) => {
	// logic to log in user
	res.json({ message: "User logged in successfully." });
});

app.get("/users/courses", userAuthentication, (req, res) => {
	// logic to list all courses
	filteredCourses = COURSES.filter((c) => c.published);
	res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
	// logic to purchase a course
	const courseId = Number(req.params.courseId);
	const course = COURSES.find((c) => c.id === courseId && c.published);
	if (course) {
		req.user.purchasedCourses.push(courseId);
		res.json({
			message: "Course Number " + courseId + " purchased successfully",
		});
	} else {
		res.status(404).json({ message: "Course Not Found" });
	}
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
	// logic to view purchased courses
	userFilteredCourses = COURSES.filter((c) =>
		req.user.purchasedCourses.includes(c.id)
	);
	res.json({ purchasedCourses: userFilteredCourses });
});

app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
