const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "NothingPhone02";

const generateJWT = (user) => {
    const payload = { username: user.username };
    return jwt.sign(payload, secretKey, { expiresIn: "120s" });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
    const newAdminData = req.body;
    const isPresent = ADMINS.find(
        (admin) => admin.username === newAdminData.username
    );
    if (isPresent) {
        res.status(403).json({ message: "Admin already present" });
    } else {
        ADMINS.push(newAdminData);
        const token = generateJWT(newAdminData);
        res.json({ message: "Admin created successfully " + token });
    }
    // logic to sign up admin
});

app.post("/admin/login", (req, res) => {
    // logic to log in admin
    const { username, password } = req.headers;
    const isAccPresent = ADMINS.find(
        (admin) => admin.username === username && admin.password === password
    );

    if (isAccPresent) {
        const token = generateJWT(isAccPresent);
        res.json({ message: "Logged in successfully", token });
    } else {
        res.status(403).json("Account not found");
    }
});

app.post("/admin/courses", (req, res) => {
    // logic to create a course
});

app.put("/admin/courses/:courseId", (req, res) => {
    // logic to edit a course
});

app.get("/admin/courses", (req, res) => {
    // logic to get all courses
});

// User routes
app.post("/users/signup", (req, res) => {
    // logic to sign up user
});

app.post("/users/login", (req, res) => {
    // logic to log in user
});

app.get("/users/courses", (req, res) => {
    // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
    // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
    // logic to view purchased courses
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
    console.log("http://localhost:3000");
});
