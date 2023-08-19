const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
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

const connectionString = "mongodb+srv://rohan17ghy:m2RUqz4JSSEQOXge@cluster0.vnffoor.mongodb.net/CourseSellDB";


mongoose.connect(connectionString, {
useNewUrlParser: true,
useUnifiedTopology: true
})
    .then(() => console.log(`Successfully connected to database`))
    .catch(error => console.log(`Error connecting to db with error: ${error}`))

const Schema = mongoose.Schema;
const adminSchema = new Schema({
    username: String,
    password: String
});

const userSchema = new Schema({
    username: String,
    password: String,
    purchasedCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean  
})

const Admin = mongoose.model('Admin', adminSchema)
const Course = mongoose.model('Course', courseSchema)
const User = mongoose.model('User', userSchema)


//ChatGPT code 
// Hash the username and password
function hashCredentials(username, password) {  
    try {  
      // Hash the username and password
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      return { username, password: hashedPassword };
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


const adminAuthentication = async (req, res, next) => {
    const { username, password } = req.headers

    const admin = await Admin.findOne({username})
    const isPasswordValid = admin ? bcrypt.compareSync(password, admin.password) : false;
    if(admin && isPasswordValid){
        const token = generateAdminToken(admin.username, admin.password)
        req.token = token
        req.admin = admin
        next()
    }else{
        res.send(403).json({ message: 'Admin authentication failed' })
    }
}

const userAuthentication = async (req, res, next) => {
    const { username, password } = req.headers
    const user = await User.findOne({username})
    const isPasswordValid = user ? bcrypt.compareSync(password, user.password) : false;
    if(user && isPasswordValid){
        const token = generateUserToken(user.username, user.password)
        req.token = token
        req.user = user
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
    try{
        const { username, password } = hashCredentials(req.body.username, req.body.password)
    
        if(await Admin.findOne({username})){
            res.status(409).json({ message: 'Admin already exists' })
            return
        }

        const admin = new Admin({username, password})
        await admin.save()
        const token = generateAdminToken(username, password)
        res.status(201).json({ message: 'Admin created successfully', token })
    }catch(error){
        res.status(505).json({ error: error.toString() })
    }
    
});

app.post('/admin/login', adminAuthentication, (req, res) => {
    // logic to log in admin
    res.json({ message: 'Admin Logged in successfully', token: req.token})
});

app.post('/admin/courses', authenticateAdminJwt, async (req, res) => {
    // logic to create a course
    try{
        const course = new Course(req.body)        
        await course.save()
        res.status(201).send({ message: 'Course created successfully', courseId: course.id })
    }catch(error){
        res.status(505).json({ 'Error': error.toString()})
    }
    

});

app.put('/admin/courses/:courseId', authenticateAdminJwt, async (req, res) => {
    // logic to edit a course
    try{
        const course = req.body
        const courseModel = await Course.findOne(req.params.courseId)
        if(!courseModel){
            res.status(404).send({ message: `Course not found` })
            return
        }
        Object.assign(courseModel, course)
        await courseModel.save();
        res.send({ message: 'Course updated successfully' })
    }catch(error){
        res.status(505).json({error: error.toString()})
    }
    
});

app.get('/admin/courses', authenticateAdminJwt, async (req, res) => {
    // logic to get all courses
    try{
        const courses = await Course.find({})
        res.json({ courses })
    }catch(err){
        res.status(505).json({error: err.toString()})
    }
    
});

// User routes
app.post('/users/signup', async (req, res) => {
    // logic to sign up user
    try{
        const { username, password } = hashCredentials(req.body.username, req.body.password)   
    
        if(await User.findOne({ username })){
            res.status(409).json({ message: 'User already exists' })
            return
        }
        
        const user = new User({ username, password, purchasedCourses: [] })
        await user.save()
        const token = generateUserToken(username, password)
        res.status(201).json({ message: 'User created successfully', token })
    }catch(err){
        res.status(505).json({error: err.toString()})
    }
    
});

app.post('/users/login', userAuthentication, (req, res) => {
    // logic to log in user
    res.json({ message: 'User Logged in successfully', token: req.token})
});

app.get('/users/courses', authenticateUserJwt, async (req, res) => {
    // logic to list all courses
    try{
        const courses = await Course.find({ published: true })
        res.json({courses})
    }catch(err){
        res.status(505).json({error: err.toString()})
    }
    
});

app.post('/users/courses/:courseId', authenticateUserJwt, async (req, res) => {
    // logic to purchase a course
    try{
        const courseId = new mongoose.Types.ObjectId(req.params.courseId);
        const user = await User.findOne({username: req.user.username})
        if(user.purchasedCourses.some(c => c === courseId)){
            res.json({ message: 'User has already purchased the course' })
            return
        }

        const course = await Course.findById(req.params.courseId)
        if(!course){
            res.status(404).json({ message: `Course with id ${req.params.courseId} doesn't exist` })
            return
        }
        
        user.purchasedCourses.push(course);
        await user.save()
        res.json({ message: 'Course purchased successfully' })
    }catch(err){
        res.status(505).json({error: err.toString()})
    }
    
});

app.get('/users/purchasedCourses', authenticateUserJwt, async (req, res) => {
    // logic to view purchased courses
    try{
        //const purchasedCourseName = Symbol.keyFor(Object.getOwnPropertySymbols(userSchema.paths.purchasedCourses)[0]);
        const user = await User.findOne({username: req.user.username}).populate('purchasedCourses')
        if(user){
            const purchasedCourses = user.purchasedCourses || []
            res.json({ purchasedCourses }) 
        }else{
            res.status(403).json({ message: 'User not found' });
        }
        
    }catch(err){
        res.status(505).json({error: err.toString()})
    }
    
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
