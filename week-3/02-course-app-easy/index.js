const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

/* This function is used to generate random IDs */
function uniqueID() {
	return Math.floor(Math.random() * 100000);
}

// Admin routes
/* ADMIN - signup */
app.post('/admin/signup', (req, res) => {
	let { username, password } = req.body;
	let userFound = ADMINS.some((admin) => admin.username === username);

	if (userFound) {
		return res.sendStatus(400);
	}

	if (username && username !== '' && password && password !== '') {
		const newAdmin = {
			id: uniqueID(),
			username,
			password,
		};
		ADMINS.push(newAdmin);
		res.status(200).send({ message: 'Admin created successfully' });
	} else {
		res.sendStatus(400);
	}
	console.log('ADMINS', ADMINS);
});

/* ADMIN - login */
app.post('/admin/login', (req, res) => {
	let { username, password } = req.body;
	let adminFound = null;

	for (let i = 0; i < ADMINS.length; i++) {
		if (username === ADMINS[i].username && password === ADMINS[i].password) {
			adminFound = ADMINS[i];
		}
	}
	if (adminFound) {
		return res.status(200).send({ message: 'Logged in successfully' });
	} else {
		res.sendStatus(401);
	}
});

/* ADMIN - create courses */
app.post('/admin/courses', (req, res) => {
	const { username, password } = req.headers;
	const { title, description, price, imageLink, published } = req.body;

	const adminExists = ADMINS.some(
		(admin) => admin.username === username && admin.password === password
	);
	if (adminExists) {
		const newCourse = {
			id: uniqueID(),
			title,
			description,
			price,
			imageLink,
			published,
		};
		COURSES.push(newCourse);
		res
			.status(200)
			.send({ message: 'Course created successfully', courseId: newCourse.id });
	} else {
		res.sendStatus(400);
	}
});

/* Admin - update a course */
app.put('/admin/courses/:courseId', (req, res) => {
	const courseId = parseInt(req.params.courseId);
	const { username, password } = req.headers;

	const { title, description, price, imageLink, published } = req.body;

	const adminExists = ADMINS.some(
		(admin) => admin.username === username && admin.password === password
	);
	if (adminExists) {
		const courseIndex = COURSES.findIndex((course) => course.id === courseId);
		const updatedCourse = {
			id: courseId,
			title,
			description,
			price,
			imageLink,
			published,
		};
		if (courseIndex === -1) {
			res.status(404).send({ message: 'Course not found' });
		} else {
			COURSES.splice(courseIndex, 1, updatedCourse);
			res.status(200).send({ message: 'Course updated successfully' });
		}
	}
	return res.status(400).send({ message: 'Admin not found' });
});

/* Admin - get all courses */
app.get('/admin/courses', (req, res) => {
	const username = req.headers.username;
	const password = req.headers.password;

	const adminExists = ADMINS.some(
		(admin) => admin.username === username && admin.password === password
	);

	if (adminExists) {
		res.status(200).send({ courses: COURSES });
	} else {
		res.status(400).send({ message: 'Admin not found' });
	}
});

// User routes
/* User - signup */
app.post('/users/signup', (req, res) => {
	let { username, password } = req.body;
	let userFound = USERS.some((user) => user.username === username);

	if (userFound) {
		return res.sendStatus(400);
	}

	if (username && username !== '' && password && password !== '') {
		const newUser = {
			id: uniqueID(),
			username,
			password,
			purchasedCourses: [],
		};
		USERS.push(newUser);
		res.status(200).send({ message: 'User created successfully' });
	} else {
		res.sendStatus(400);
	}
	console.log('USERS', USERS);
});

/* User - login */
app.post('/users/login', (req, res) => {
	let { username, password } = req.body;
	let userFound = null;

	for (let i = 0; i < USERS.length; i++) {
		if (username === USERS[i].username && password === USERS[i].password) {
			userFound = USERS[i];
		}
	}
	if (userFound) {
		return res.status(200).send({ message: 'Logged in successfully' });
	} else {
		res.sendStatus(401);
	}
});

/* User - get all courses */
app.get('/users/courses', (req, res) => {
	const username = req.headers.username;
	const password = req.headers.password;

	const userExists = USERS.some(
		(user) => user.username === username && user.password === password
	);

	if (userExists) {
		res.status(200).send({ courses: COURSES });
	} else {
		res.status(400).send({ message: 'User not found' });
	}
});

/* User - purchase a course */
app.post('/users/courses/:courseId', (req, res) => {
	const username = req.headers.username;
	const password = req.headers.password;

	const courseId = parseInt(req.params.courseId);

	const user = USERS.find(
		(user) => user.username === username && user.password === password
	);
	if (!user) {
		return res.status(400).send({ message: 'User does not exist' });
	}

	const course = COURSES.find((course) => course.id === courseId);
	if (!course) {
		return res.status(400).send({ message: 'Course does not exist' });
	}

	const purchasedCourses = user.purchasedCourses;
	if (purchasedCourses.includes(course)) {
		return res.status(400).send({ message: 'Course already purchased' });
	}

	purchasedCourses.push(course);
	return res.status(200).send({ purchasedCourses });
});

/* User - get all purchased courses */
app.get('/users/purchasedCourses', (req, res) => {
	const username = req.headers.username;
	const password = req.headers.password;

	const user = USERS.find(
		(user) => user.username === username && user.password === password
	);
	if (!user) {
		return res.status(400).send({ message: 'User does not exist' });
	}
	const purchasedCourses = user.purchasedCourses;
	res.status(200).send({ purchasedCourses });
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});
