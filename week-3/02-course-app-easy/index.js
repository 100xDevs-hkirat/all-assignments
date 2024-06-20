const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [
    {
        title: "course 1",
        description: "course-descriptio 1",
        price: 1,
        imageLink: "https://linktoimage.com",
        published: true,
        courseId: 1,
    },
    {
        title: "course 2",
        description: "course-descriptio 2",
        price: 2,
        imageLink: "https://linktoimage.com",
        published: false,
        courseId: 2,
    },
    {
        title: "course 3",
        description: "course-descriptio 3",
        price: 3,
        imageLink: "https://linktoimage.com",
        published: true,
        courseId: 3,
    },
];

const adminAuthentication = (req, res, next) => {
    const { username, password } = req.headers;
    const admin = ADMINS.find(
        (a) => a.username === username && a.password === password
    );
    if (admin) {
        next();
    } else {
        res.status(403).json({ message: "Admin authentication failed" });
    }
};

const userAuthentication = (req, res, next) => {
    const { username, password } = req.headers;
    const user = USERS.find(
        (u) => u.username === username && u.password === password
    );
    if (user) {
        req.user = user; // Add user object to the request
        next();
    } else {
        res.status(403).json({ message: "User authentication failed" });
    }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
    data = req.body;
    isPresent = ADMINS.find((a) => a.username === data.username);
    if (isPresent) {
        res.status(403).send({ message: "Admin Already present" });
    } else {
        ADMINS.push(data);
        res.status(200).send({ message: "Admin created successfully" });
    }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
    res.json({ message: "Logged in successfully" });
    // logic to log in admin
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
    // logic to create a course
    data = req.body;
    data.id = Date.now();
    COURSES.push(data);
    res.status(200).json({
        message: "Course created successfully",
        courseId: data.id,
    });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
    // logic to edit a course
    const courseId = parseInt(req.params.courseId);
    const course = COURSES.find((c) => c.id === courseId);
    if (course) {
        Object.assign(course, req.body);
        res.json({ message: "Course updated successfully" });
    } else {
        res.status(404).json({
            message: "Course not found",
        });
    }
});

app.get("/admin/courses", (req, res) => {
    // logic to get all courses
    res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
    // logic to sign up user
    data = req.body;
    const isPresent = USERS.find((u) => u.username === data.username);
    if (isPresent) {
        res.status(403).json({ message: "User Already Exists" });
    } else {
        USERS.push(data);
        res.json({ message: "User created successfully" });
    }
});

app.post("/users/login", userAuthentication, (req, res) => {
    res.json({ message: "Logged in successfully" });
    // logic to log in user
});

app.get("/users/courses", (req, res) => {
    // logic to list all courses
    res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
    const courseId = Number(req.params.courseId);
    const course = COURSES.find((c) => c.id === courseId && c.published);
    if (course) {
        if (req.user.purchasedCourses) {
            req.user.purchasedCourses.push(courseId);
        } else {
            req.user.purchasedCourses = [];
            req.user.purchasedCourses.push(courseId);
        }
        res.json({ message: "Course purchased successfully" });
    } else {
        res.status(404).json({ message: "Course not found or not available" });
    }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
    // logic to view purchased courses
    if (req.user.purchasedCourses) {
        coursesID = req.user.purchasedCourses;
        purchasedCourses = [];
        coursesID.forEach((element) => {
            var course = COURSES.find((c) => c.id === element);
            purchasedCourses.push(course);
        });
        res.json({ purchasedCourses: purchasedCourses });
    } else {
        res.json({ message: "No courses Purchased" });
    }
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
