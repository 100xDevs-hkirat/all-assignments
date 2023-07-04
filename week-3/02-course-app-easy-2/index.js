const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//It is important to have different secrets for users and admins.
//If not then user can access admin routes
const secretKeyAdmin = 'superS3cr3tAdMin'; // Replace with your own secret key
const secretKeyUser = 'superS3cr3t1UsEr'; // Replace with your own secret key

//Salt is a sensitive information and needs to be stored securely for future use
const saltRounds = 10; // Number of salt rounds for bcrypt
const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt


//ChatGPT code 
// Hash the username and password
function hashCredentials(username, password) {  
    try {  
      // Hash the username and password
      const hashedUsername = bcrypt.hashSync(username, salt);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      return { username: hashedUsername, password: hashedPassword };
    } catch (error) {
      // Handle error
      throw new Error('Error hashing credentials');
    }
}

//ChatGPT code
// Compare stored hashed credentials with user input
function compareCredentials(username, password, storedUsername, storedPassword) {
    try {
      const usernameMatch = bcrypt.compareSync(username, storedUsername);
      const passwordMatch = bcrypt.compareSync(password, storedPassword);
  
      return usernameMatch && passwordMatch;
    } catch (error) {
      // Handle error
      throw new Error('Error comparing credentials');
    }
}

// Generate a JWT token for admin
function generateAdminToken(username, password) {
    const payload = {
        username,
        password
        // Add any additional user data to the payload as needed
    };


    const options = {
        expiresIn: '1h', // Token expiration time
    };

    return jwt.sign(payload, secretKeyAdmin, options);
}

// Generate a JWT token for users
function generateUserToken(username, password) {
    const payload = {
        username,
        password
        // Add any additional user data to the payload as needed
    };


    const options = {
        expiresIn: '1h', // Token expiration time
    };

    return jwt.sign(payload, secretKeyUser, options);
}

// Authenticate Admin JWT token
function authenticateAdminToken(token) {  
    try {
      const decoded = jwt.verify(token, secretKeyAdmin);
      return decoded;
    } catch (error) {
      // Token is invalid or expired
      throw new Error('Invalid or expired token');
    }
}

// Authenticate User JWT token
function authenticateUserToken(token) {  
    try {
      const decoded = jwt.verify(token, secretKeyUser);
      return decoded;
    } catch (error) {
      // Token is invalid or expired
      throw new Error('Invalid or expired token');
    }
}


const adminAuthentication = (req, res, next) => {
    const { username, password } = req.headers
    const admin = ADMINS.find(a => compareCredentials(username, password, a.username, a.password))
    if(admin){
        const token = generateAdminToken(admin.username, admin.password)
        req.token = token
        next()
    }else{
        res.send(403).json({ message: 'Admin authentication failed' })
    }
}

const userAuthentication = (req, res, next) => {
    const { username, password } = req.headers
    const user = USERS.find(a => compareCredentials(username, password, a.username, a.password))
    if(user){
        const token = generateUserToken(user.username, user.password)
        req.token = token
        next()
    }else{
        res.send(403).json({ message: 'User authentication failed' })
    }
}

//Verify the Admin JWT
const authenticateAdminJwt = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        try{
            const admin = authenticateAdminToken(token)
            req.admin = admin
            next()
        }
        catch(err){
            res.sendStatus(403)
        }        
    }else{
        res.sendStatus(401);
    }
}


//Verify the User JWT
const authenticateUserJwt = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        try{
            const user = authenticateUserToken(token)
            req.user = user
            next()
        }
        catch(err){
            res.sendStatus(403)
        }        
    }else{
        res.sendStatus(401);
    }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
    // logic to sign up admin
    const { username, password } = hashCredentials(req.body.username, req.body.password)
    if(ADMINS.some(a => a.username === username)){
        res.status(409).json({ message: 'Admin already exists' })
        return
    }
    ADMINS.push({username, password})
    const token = generateAdminToken(username, password)
    res.status(201).json({ message: 'Admin created successfully', token })
});

app.post('/admin/login', adminAuthentication, (req, res) => {
    // logic to log in admin
    res.json({ message: 'Admin Logged in successfully', token: req.token})
});

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
    // logic to create a course
    const course = req.body
    course.courseId = COURSES.length + 1
    COURSES.push(course)
    res.status(201).send({ message: 'Course created successfully', courseId: course.courseId })

});

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
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

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
    // logic to get all courses
    res.json({ courses: COURSES })
});

// User routes
app.post('/users/signup', (req, res) => {
    // logic to sign up user
    const { username, password } = hashCredentials(req.body.username, req.body.password)
    const user = { username, password, purchasedCourses: [] }
    if(USERS.some(u => u.username === username)){
        res.status(409).json({ message: 'User already exists' })
        return
    }
    USERS.push(user)
    const token = generateUserToken(username, password)
    res.status(201).json({ message: 'Admin created successfully', token })
});

app.post('/users/login', userAuthentication, (req, res) => {
    // logic to log in user
    res.json({ message: 'User Logged in successfully', token: req.token})
});

app.get('/users/courses', authenticateUserJwt, (req, res) => {
    // logic to list all courses
    res.json({courses: COURSES})
});

app.post('/users/courses/:courseId', authenticateUserJwt, (req, res) => {
    // logic to purchase a course
    const courseId = Number(req.params.courseId);
    const user = USERS.find(u => u.username === req.user.username)
    if(user.purchasedCourses.some(c => c === courseId)){
        res.json({ message: 'User has already purchased the course' })
        return
    }
    if(!COURSES.some(c => c.courseId === courseId)){
        res.status(404).json({ message: `Course with id ${courseId} doesn't exist` })
        return
    }
    user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' })
});

app.get('/users/purchasedCourses', authenticateUserJwt, (req, res) => {
    // logic to view purchased courses
    const user = USERS.find(u => u.username === req.user.username)
    const purchasedCourses = user.purchasedCourses.map(id => COURSES.find(c => c.courseId === id))
    res.json(purchasedCourses) 
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
