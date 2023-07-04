const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
    const { username, password } = req.headers
    const admin = ADMINS.find(a => a.username === username && a.password === password)
    if(admin){
        next()
    }else{
        res.send(403).json({ message: 'Admin authentication failed' })
    }
}

const userAuthentication = (req, res, next) => {
    const { username, password } = req.headers
    const user = USERS.find(a => a.username === username && a.password === password)
    if(user){
        req.user = user
        next()
    }else{
        res.send(403).json({ message: 'User authentication failed' })
    }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
    // logic to sign up admin
    const {username, password} = req.body
    ADMINS.push({ username: username, password: password })
    res.status(201).json({ message: 'Admin created successfully' })
});

app.post('/admin/login', adminAuthentication, (req, res) => {
    // logic to log in admin
    res.json({ message: 'Admin Logged in successfully' })
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
    // logic to create a course

    const course = req.body
    course.courseId = Date.now()
    COURSES.push(course)
    res.status(201).send({ message: 'Course created successfully', courseId: course.courseId })
  
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
    // logic to edit a course  
    const course = req.body
    const courseId = Number(req.params.courseId) 
    let index = COURSES.findIndex(c => c.courseId === courseId)
    if(index == -1){
    res.status(404).send({ message: `Course not found` })
    return
    }
    Object.assign(COURSES[index], course)
    res.send({ message: 'Course updated successfully' })
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
    // logic to get all courses  
    res.json({ courses: COURSES })
});

// User routes
app.post('/users/signup', (req, res) => {
    // logic to sign up user
    const { username, password } = req.body
    USERS.push({ username, password, purchasedCourses : []})

    res.status(201).send({ message: 'User created successfully' })
});

app.post('/users/login', userAuthentication, (req, res) => {
    // logic to log in user
    res.json({ message: 'User Logged in successfully' })
})

app.get('/users/courses', userAuthentication, (req, res) => {
    // logic to list all courses  
    res.json({courses: COURSES})
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
    // logic to purchase a course
    const courseId = Number(req.params.courseId);
    if(req.user.purchasedCourses.some(c => c === courseId)){
        res.json({ message: 'User has already purchased the course' })
        return
    }
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' })
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
    // logic to view purchased courses
    const purchasedCourses = req.user.purchasedCourses.map(id => COURSES.find(c => c.courseId === id))
    res.json(purchasedCourses)  
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
