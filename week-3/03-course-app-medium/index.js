const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

let ADMINS_FILE = "admin_details.json"
let USERS_FILE = "user_details.json"
let COURSES_FILE = "course_details.json"
let PURCHASED_FILE = "purchase_details.json"

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASED = {};

try{
  files = fs.readdirSync('./files/');
  // console.log("files: ", files)
  if (files.includes(ADMINS_FILE) && files.includes(USERS_FILE) && files.includes(COURSES_FILE) && files.includes(PURCHASED_FILE)){
    ADMINS = JSON.parse(fs.readFileSync('./files/'+ADMINS_FILE));
    USERS = JSON.parse(fs.readFileSync('./files/'+USERS_FILE));
    COURSES = JSON.parse(fs.readFileSync('./files/'+COURSES_FILE));
    PURCHASED = JSON.parse(fs.readFileSync('./files/'+PURCHASED_FILE));
    // console.log("In if")
  } else{
    // console.log("In else")
    fs.writeFileSync('./files/'+ADMINS_FILE, JSON.stringify(ADMINS), 'utf-8')
    fs.writeFileSync('./files/'+USERS_FILE, JSON.stringify(USERS), 'utf-8')
    fs.writeFileSync('./files/'+COURSES_FILE, JSON.stringify(COURSES), 'utf-8')
    fs.writeFileSync('./files/'+PURCHASED_FILE, JSON.stringify(PURCHASED), 'utf-8')
  }
  // console.log("In try")
} catch{
  ADMINS = [];
  USERS = [];
  COURSES = [];
  PURCHASED = [];
  // console.log("In catch")
}
// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// let PURCHASED = [];
// let FLAG = 0;
let id = Math.max(...COURSES.map(item=> item.id)) | 0;


function adminAuthentication(req, res, next){
  username = req.headers.username;
  password = req.headers.password;

  let found = ADMINS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}

function userAuthentication(req, res, next){
  username = req.headers.username;
  password = req.headers.password;

  let found = USERS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let adminDetails = {
    username : req.body.username,
    password : req.body.password
  }
  // console.log("ADMINS: ", ADMINS)
  let found = ADMINS.find((ele)=>{
    return (ele["username"]===adminDetails["username"] && ele["password"]===adminDetails["password"])
  })
  // console.log("found: ", found)
  if (found){
    res.status(403).json({ message: 'User already exits!' });
  } else{
    ADMINS.push(adminDetails);
    fs.writeFileSync('./files/'+ADMINS_FILE, JSON.stringify(ADMINS), 'utf8')
    res.json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ "message": 'Logged in successfully' })
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  id += 1;
  COURSES.push({
    title : req.body.title,
    description : req.body.description,
    price : req.body.price,
    imageLink : req.body.imageLink,
    published : req.body.published,
    id:id
  })
  fs.writeFileSync('./files/'+COURSES_FILE, JSON.stringify(COURSES), 'utf8');
  res.json({ message: 'Course created successfully', courseId: id});
})

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  let idNo = req.params.courseId;
  // console.log(typeof idNo);
  // console.log("idNo: ", idNo)
  let found = COURSES.find((ele)=>{
    return (ele["id"] == idNo); // used '==' here instead of '===' as the typeof 'idNo' is string and 'id' is int
  })

  // console.log("found: ", found)
  if (found){
    Object.assign(found, req.body);
    // console.log("COURSES: ", COURSES)
    fs.writeFileSync('./files/'+COURSES_FILE, JSON.stringify(COURSES), 'utf8');
    res.json({ message: 'Course updated successfully' });
  } else{
    // console.log("COURSES: ", COURSES)
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let userDetails = {
    username : req.body.username,
    password : req.body.password
  }

  let found = USERS.find((ele)=>{
    return (ele["username"]===userDetails["username"] && ele["password"]===userDetails["password"])
  })
  // console.log("found: ", found)
  if (found){
    res.status(403).json({ message: 'User already exits!' });
  } else{
    USERS.push(userDetails);
    fs.writeFileSync('./files/'+USERS_FILE, JSON.stringify(USERS), 'utf8');
    res.json({ message: 'User created successfully' });
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ "message": 'Logged in successfully' })
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  res.json(COURSES);
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  let username = req.headers.username;
  let idNo = req.params.courseId;
  let found = COURSES.find((ele)=>{
    return (ele["id"] == idNo); // used '==' here instead of '===' as the typeof 'idNo' is string and 'id' is int
  })

  if (found){
    if (PURCHASED[username]){
      PURCHASED[username].push(found);
    } else{
      PURCHASED[username] = [found]
    }
    // PURCHASED.push(found);
    fs.writeFileSync('./files/'+PURCHASED_FILE, JSON.stringify(PURCHASED), 'utf8')
    res.json({ message: 'Course purchased successfully' });
  } else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  let username = req.headers.username;
  let found = PURCHASED[username];

  res.json(found);
});

app.use((req, res)=>{
  res.status(404).send("Not found!");
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
