const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = 'cluster0.hhinerl.mongodb.net'
const SECRET = process.env.SECRET;
mongoose.connect(`mongodb+srv://${user}:${pass}@${host}/${db}`).then(()=>{
  console.log("MongoDb Connected");
});

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

let admins = new mongoose.Schema({
    username: String,
    password: String,
});
let users = new mongoose.Schema({
    username: String,
    password: String,
    courses: [{ type: mongoose.Types.ObjectId, ref: 'Courses' }]
});
let courses = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
})

let Admins = mongoose.model('Admins', admins);
let Users = mongoose.model('users', users);
let Courses = mongoose.model('Courses', courses);

const auth = (req,res,next)=>{
    if(req.headers.authorization===undefined)
        res.sendStatus(401);
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token,SECRET,(err,user)=>{
    if(err){
        res.sendStatus(403);
    }
    if(user){
        req.user = user;
        next();
    }
    });
}

const getToken = (obj)=>{
    return jwt.sign(obj,SECRET,{expiresIn:"1h"});
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
    // logic to sign up admin
    let adminObj = {
        username : req.body.username,
        password : req.body.password
    }
    let resp = await Admins.findOne({username:req.body.username}).exec();
    if(resp!==null){
        res.status(200).send({ message: 'Admin already exists' });
    } else {
        (new Admins(adminObj)).save();
        let token = getToken(adminObj);
        res.status(201).send({ message: 'Admin created successfully', token })
    }
});

app.post('/admin/login', async (req, res) => {
    // logic to log in admin
    let obj = {username:req.headers.username,password:req.headers.password};
    let resp = await Admins.findOne(obj).exec();
    if(resp!==null){
        let token = getToken(obj);
        res.status(201).send({token});
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

app.post('/admin/courses', auth, (req, res) => {
    // logic to create a course
    let courseObj = {title,description,price,imageLink,published} = req.body;
    let course = new Courses(courseObj);
    course.save();
    res.status(201).send({message:'Course created successfully',coursId:course.id})
});

app.put('/admin/courses/:courseId', auth, async (req, res) => {
    let course = {title,description,price,imageLink,published} = req.body;
    let id = req.params.courseId;
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).send({message:"Invalid Id"});
    } else {
        let idExists = await Courses.findById(id).exec();
        if(!idExists){
            res.sendStatus(404);
            return;
        }
        await Courses.findByIdAndUpdate(id,course,{new:true}).exec();
        res.status(201).send({ message: 'Course updated successfully' });
    }
});

app.get('/admin/courses', auth, async (req, res) => {
    // logic to get all courses
    let courses = await Courses.find().exec();
    res.status(200).send(courses); 
});

// User routes
app.post('/users/signup', async (req, res) => {
    // logic to sign up user
    let usersObj = {
        username : req.body.username,
        password : req.body.password
    }
    let resp = await Users.findOne({username:req.body.username}).exec();
    console.log(resp);
    if(resp!=null){
        res.status(403).send({ message: 'User already exists' });
    } else {
        (new Users(usersObj)).save();
        let token = getToken(usersObj);
        res.status(201).send({ message: 'User created successfully', token })
    }
});

app.post('/users/login', async(req, res) => {
    // logic to log in user
    let obj = {username:req.headers.username,password:req.headers.password};
    let resp = await Users.findOne(obj).exec();
    if(resp!==null){
        let token = getToken(obj);
        res.status(201).send({token});
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

app.get('/users/courses', auth, async (req, res) => {
    // logic to list all courses
    let courses = await Courses.find({published:true}).exec();
    res.status(200).send(courses);
});

app.post('/users/courses/:courseId', (req, res) => {
    // logic to purchase a course
    
});

app.get('/users/purchasedCourses', (req, res) => {
    // logic to view purchased courses
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

process.on('SIGINT', () => {
  mongoose.disconnect().then(() => {
    console.log("Gracefull Shutdown");
      process.exit();
  });
});