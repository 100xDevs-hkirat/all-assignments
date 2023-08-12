require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const fs = require('fs');
const path = require('path');

const SECRET_KEY = process.env.ADMIN_JWT_SECRET_KEY;
const ADMINS_PATH = path.join(__dirname, 'data', 'admins.json');
const USERS_PATH = path.join(__dirname, 'data', 'users.json');
const COURSES_PATH = path.join(__dirname, 'data', 'courses.json');
const ADMIN_ROLE = 'admin';
const USER_ROLE = 'user';

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
	ADMINS = JSON.parse(fs.readFileSync(ADMINS_PATH, 'utf-8'));
	USERS = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
	COURSES = JSON.parse(fs.readFileSync(COURSES_PATH, 'utf-8'));
} catch {
	ADMINS = [];
	USERS = [];
	COURSES = [];
}

const authenticateJwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, SECRET_KEY, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}
			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

const getJwtToken = (user, secretKey, role) => {
	const payload = { username: user.username, role: role };
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
		fs.writeFileSync(ADMINS_PATH, JSON.stringify(ADMINS));
		const token = getJwtToken(admin, SECRET_KEY, ADMIN_ROLE);
		res.status(200).json({ message: 'Admin created successfully', token });
	}
});

app.post('/admin/login', (req, res) => {
	const { username, password } = req.headers;
	const admin = {
		username,
		password,
	};
	if (adminExists(admin)) {
		const token = getJwtToken(admin, SECRET_KEY, ADMIN_ROLE);
		res.json({ message: 'Logged in successfully', token });
	} else {
		res.status(403).json({ message: 'Admin authentication failed' });
	}
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
	const course = req.body;
	course.id = Date.now();
	COURSES.push(course);
	fs.writeFileSync(COURSES_PATH, JSON.stringify(COURSES));
	res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
	const courseId = Number(req.params.courseId);
	const course = COURSES.find(course => course.id === courseId);
	if (course) {
		Object.assign(course, req.body);
		fs.writeFileSync(COURSES_PATH, JSON.stringify(COURSES));
		res.json({ message: 'Course updated successfully' });
	} else {
		res.status(404).json({ message: 'Course not found' });
	}
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
	res.json({ courses: COURSES });
});

app.post('/users/signup', (req, res) => {
	const user = { ...req.body, purchasedCourses: [] };
	if (userExists(user)) {
		res.status(403).json({ message: 'User already exists' });
	} else {
		user.purchasedCourses = [];
		USERS.push(user);
		fs.writeFileSync(USERS_PATH, JSON.stringify(USERS));
		const token = getJwtToken(user, SECRET_KEY);
		res.json({ message: 'User created successfully', token: token });
	}
});

app.post('/users/login', (req, res) => {
	const { username, password } = req.headers;
	const user = {
		username,
		password,
	};
	if (userExists(user)) {
		const token = getJwtToken(user, SECRET_KEY);
		res.json({ message: 'Logged in successfully', token: token });
	} else {
		res.sendStatus(401);
	}
});

app.get('/users/courses', authenticateJwt, (req, res) => {
	const publishedCourses = COURSES.filter(course => course.published);
	res.json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
	const courseId = Number(req.params.courseId);
	const course = COURSES.find(c => c.id === courseId && c.published);
	if (course) {
		const user = USERS.find(u => u.username === req.user.username);
		if (userExists(user)) {
			if (!user.purchasedCourses) {
				user.purchasedCourses = [];
			}
			user.purchasedCourses.push(course);
			fs.writeFileSync(USERS_PATH, JSON.stringify(USERS));
			res.json({ message: 'Course purchased successfully' });
		} else {
			res.status(403).json({ message: 'User not found' });
		}
	} else {
		res.status(404).json({ message: 'Course not found or not available' });
	}
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
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
