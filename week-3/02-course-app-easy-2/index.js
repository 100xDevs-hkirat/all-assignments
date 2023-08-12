const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const adminSecretKey = process.env.ADMIN_JWT_SECRET_KEY;
const userSecretKey = process.env.USER_JWT_SECRET_KEY;

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const authenticateAdminJwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, adminSecretKey, (err, admin) => {
			if (err) {
				return res.sendStatus(403);
			}
			req.admin = admin;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

const authenticateUserinJwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, userSecretKey, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).json({ message: 'User authentication failed' });
	}
};

const getJwtToken = (user, secretKey) => {
	const payload = { username: user.username };
	const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
	return token;
};
const adminExists = admin => {
	const existingAdmin = ADMINS.find(a => a.username == admin.username);
	return existingAdmin;
};
const userExists = user => {
	const existingUser = USERS.find(u => u.username == user.username);
	return existingUser;
};

app.post('/admin/signup', (req, res) => {
	const admin = req.body;
	if (adminExists(admin)) {
		res.status(403).json({ message: 'Admin already exists' });
	} else {
		ADMINS.push(admin);
		const token = getJwtToken(admin, adminSecretKey);
		res.status(200).json({ message: 'Admin created successfully', token });
	}
});

app.post('/admin/login', (req, res) => {
	const { username, password } = req.headers;
	const admin = {
		username,
		password,
	};
	if (adminExists(admin)) res.json({ message: 'Logged in successfully' });
	else {
		res.status(403).json({ message: 'Admin authentication failed' });
	}
});

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
	const course = req.body;
	course.id = Date.now();
	COURSES.push(course);
	res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
	const courseId = Number(req.params.courseId);
	const course = COURSES.find(course => course.id === courseId);
	if (course) {
		Object.assign(course, req.body);
		res.json({ message: 'Course updated successfully' });
	} else {
		res.status(404).json({ message: 'Course not found' });
	}
});

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
	res.json({ courses: COURSES });
});

app.post('/users/signup', (req, res) => {
	const user = { ...req.body, purchasedCourses: [] };
	if (userExists(user)) {
		res.status(403).json({ message: 'User already exists' });
	} else {
		user.purchasedCourses = [];
		USERS.push(user);
		const token = getJwtToken(user, userSecretKey);
		res.json({ message: 'User created successfully', token: token });
	}
});

app.post('/users/login', (req, res) => {
	const { username, password } = req.headers;
	const user = {
		username,
		password,
	};
	console.log(user);
	if (userExists(user)) {
		const token = getJwtToken(user, userSecretKey);
		res.json({ message: 'Logged in successfully', token: token });
	} else {
		res.sendStatus(401);
	}
});

app.get('/users/courses', authenticateUserinJwt, (req, res) => {
	const publishedCourses = COURSES.filter(course => course.published);
	res.json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId', authenticateUserinJwt, (req, res) => {
	const courseId = Number(req.params.courseId);
	const course = COURSES.find(c => c.id === courseId && c.published);
	if (course) {
		const user = USERS.find(u => u.username === req.user.username);
		if (userExists(user)) {
			if (!user.purchasedCourses) {
				user.purchasedCourses = [];
			}
			user.purchasedCourses.push(course);
			res.json({ message: 'Course purchased successfully' });
		} else {
			res.status(403).json({ message: 'User not found' });
		}
	} else {
		res.status(404).json({ message: 'Course not found or not available' });
	}
});

app.get('/users/purchasedCourses', authenticateUserinJwt, (req, res) => {
	const user = USERS.find(u => u.username === req.user.username);
	if (userExists(user) && user.purchasedCourses) {
		res.json({ purchasedCourses: user.purchasedCourses });
	} else {
		res.status(404).json({ message: 'No courses purchased' });
	}
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});
