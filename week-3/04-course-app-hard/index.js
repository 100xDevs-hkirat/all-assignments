require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

// Adding middleware to the application
app.use(express.json());

// Constants
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ADMIN_ROLE = 'admin';
const USER_ROLE = 'user';

// Mongoose schema
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
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

// create mongoose models/table/collection
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

const authenticateJwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
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

// connect to Mongo
mongoose.connect(process.env.MONGO_KEY, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const getJwtToken = (username, role) => {
	const payload = { username, role };
	const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
	return token;
};

app.post('/admin/signup', async (req, res) => {
	const { username, password } = req.body;
	const existingAdmin = await Admin.findOne({ username });
	if (existingAdmin) {
		res.status(403).json({ message: 'Admin already exists' });
	} else {
		const newAdmin = new Admin({ username, password });
		await newAdmin.save();
		const token = getJwtToken(username, ADMIN_ROLE);
		res.status(200).json({ message: 'Admin created successfully', token });
	}
});

app.post('/admin/login', async (req, res) => {
	const { username, password } = req.headers;

	const existingAdmin = await Admin.findOne({ username, password });
	if (existingAdmin) {
		const token = getJwtToken(username, ADMIN_ROLE);
		res.json({ message: 'Logged in successfully', token });
	} else {
		res.status(403).json({ message: 'Admin authentication failed' });
	}
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
	const course = new Course(req.body);
	await course.save();
	res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
	const udpatedCourse = Course.findByIdAndUpdate(
		Number(req.params.courseId),
		req.body,
		{
			new: true,
		}
	);
	if (udpatedCourse) {
		res.json({ message: 'Course updated successfully' });
	} else {
		res.status(404).json({ message: 'Course not found' });
	}
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
	const courses = await Course.find({});
	res.json({ courses });
});

app.post('/users/signup', async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({ username });
	if (existingUser) {
		res.status(403).json({ message: 'User already exists' });
	} else {
		const newUser = new User({ username, password });
		await newUser.save();
		const token = getJwtToken(username, USER_ROLE);
		res.json({ message: 'User created successfully', token: token });
	}
});

app.post('/users/login', async (req, res) => {
	const { username, password } = req.headers;
	const user = {
		username,
		password,
	};
	const existingUser = await User.findOne({ username, password });
	if (existingUser) {
		const token = getJwtToken(user, USER_ROLE);
		res.json({ message: 'Logged in successfully', token: token });
	} else {
		res.sendStatus(401);
	}
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
	const publishedCourses = await Course.find({ published: true });
	res.json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
	const course = await Course.findById(req.params.courseId);
	if (course.published) {
		const user = await User.findOne({ username: req.user.username });
		if (user) {
			const courseIdObj = new mongoose.Types.ObjectId(course.id);
			if (!user.purchasedCourses.includes(courseIdObj)) {
				user.purchasedCourses.push(course);
				await user.save();
				res.json({ message: 'Course purchased successfully' });
			} else {
				res.status(409).json({ message: 'Course already purchased' });
			}
		} else {
			res.status(403).json({ message: 'User not found' });
		}
	} else {
		res.status(404).json({ message: 'Course not found or not available' });
	}
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
	const user = await User.findOne({ username: req.user.username }).populate(
		'purchasedCourses'
	);
	if (user) {
		res.json({ purchasedCourses: user.purchasedCourses || [] });
	} else {
		res.status(404).json({ message: 'No courses purchased' });
	}
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});
