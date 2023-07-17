const express = require('express');
const app = express();
const jwt=require("jsonwebtoken")

app.use(express.json());
var admin_string="superSecret1";
var user_string="supersecret2";
let ADMINS = [];
let USERS = [];
let COURSES = [];
var courseId=1;
//Authorize Admin
function authorize(req,res,next){
  var temp=req.headers.authorization
  var hash_code=temp.split(" ")[1];
  //console.log(hash_code);
  var username=" ";
  jwt.verify(hash_code,admin_string,(err,data)=>{
    username=data;
  })
  var find_user=ADMINS.find(a=> a.username===username);
  if(find_user){
    next();
  }
  else{
    res.status(404).send("Invalid Credentials");
  }
}

//User Authorization
function user_authorize(req,res,next){
  var header=req.headers;
  //console.log(header)
  var hash_code=header.authorization.split(" ")[1]
  var username=false;
  jwt.verify(hash_code,user_string,(err,data)=>{
    username=data;
  })
  var find_user=USERS.find(a=>a.username===username)
  if(find_user){
    req.user=find_user
    next();
  }
  else{
    res.status(400).send({message:"Authorization Failed"});
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var {username,password}=req.body;
  var admin_element=ADMINS.find(a=> a.username==username)
  if(admin_element){
    res.status(404).send({message:"Admin Already Present"});
  }
  else{
    ADMINS.push({username,password});
    var hash_code=jwt.sign(username,admin_string);
    res.send({message:"Admin Created Successfully",token:hash_code})
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var {username,password}=req.headers;
  var admin_element=ADMINS.find(a=> a.username===username && a.password===password);
  if(admin_element){
    res.send({message:"Login Successful",jwt:jwt.sign(username,admin_string)});
  }
  else{
    res.status(404).send("Login Failed");
  }
});

app.post('/admin/courses',authorize, (req, res) => {
  // logic to create a course
  var course_details=req.body;
  course_details.id=courseId;
  COURSES.push(course_details);
  res.send({message:"Course Created Successfully",courseId:courseId++});
});

app.put('/admin/courses/:courseId',authorize, (req, res) => {
  // logic to edit a course
  var in_id=req.params.courseId;
  var find_course=COURSES.find(a=> a.id==in_id);
  if(find_course){
    Object.assign(find_course,req.body);
    res.send("Course Updated Successfully");
  }
  else{
    res.status(404).send("Invalid Course ID");
  }
});

app.get('/admin/courses', authorize,(req, res) => {
  // logic to get all courses
  res.send({courses:COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var {username,password}=req.body;
  var find_user=USERS.find(a=>a.username===username)
  if(find_user){
    res.send({message:"User Already Present"});
  }
  else{
    purchased_courses=[]
    USERS.push({username,password,purchased_courses});
    res.send("Account Successfully Created")
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var {username,password}=req.headers;
  var find_user=USERS.find(a=> a.username===username && a.password===password);
  if(find_user){
    var hash_code=jwt.sign(username,user_string)
    res.send({Message:"User Login Successful",jwt_token:hash_code})
  }
  else{
    res.status(404).send("Login Unsuccessfull Check Your Credentials")
  }
});

app.get('/users/courses',user_authorize, (req, res) => {
  // logic to list all courses
  res.send({Courses:COURSES});
});

app.post('/users/courses/:courseId',user_authorize, (req, res) => {
  // logic to purchase a course
  var in_id=parseInt(req.params.courseId);
  var find_id=COURSES.find(a=> a.id===in_id)
  if(find_id){
    req.user.purchased_courses.push(find_id)
    res.send("Course Purchased Successfully");
  }
  else{
    res.status(404).send("Invalid CourseID");
  }
});

app.get('/users/purchasedCourses', user_authorize,(req, res) => {
  // logic to view purchased courses
  res.send({purchasedCourses:req.user.purchased_courses})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
