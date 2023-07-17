const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
var courseid=1
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username,password}=req.body;
  const user=ADMINS.find(a=>a.username===username);
  if(user){
    res.status(404).json({"msg":"User Already Exists"});
  }
  else{
    ADMINS.push({username,password});
    res.send({"Message":"Admin created Successfully"});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username=req.headers.username
  var password=req.headers.password
  var FindUser=ADMINS.find(a=>a.username===username && a.password===password)
  if(FindUser){
    req.user=FindUser;
    res.send({Message:"Logged in successful"})
  }
  else{
    res.status(404).send({"message":"user does not Exist"});
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var {username,password}=req.headers;
  var course=req.body;
  course.id=courseid++;
  var findUser=ADMINS.find(a=>a.username===username && a.password===password)
  if(findUser){
    COURSES.push(course);
    res.status(200).send({message:"Course Created Successfully",courseId:course.id});
  }
  else{
    res.send({message:"Invalid Username and Password"});
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var in_cid=parseInt(req.params.courseId);
  var update_course=req.body;
  var find_course=COURSES.find(a=>a.id===in_cid);
  if(find_course){
    Object.assign(find_course,update_course);    
    res.send({message:"Course Updated Successfully"})
  }
  else{
    res.send({message:"Course Not Found"});
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var {username,password}=req.headers;
  var find_user=ADMINS.find(a=> a.username===username && a.password===password);
  if(find_user){
    res.send(COURSES);
  }
  else{
    res.status(404).send({"Message":"Login Crerdintials Are Wrong"})
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user=req.body;
  const user1=USERS.find(a=>a.username===user.username);
  if(user1){
    res.status(404).json({"msg":"User Already Exists"});
  }
  else{
    user.purchasedCourses=[]
    USERS.push(user);
    res.send({"Message":"USER created Successfully"});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username=req.headers.username
  var password=req.headers.password
  var FindUser=USERS.find(a=>a.username===username && a.password===password)
  if(FindUser){
    req.user=FindUser;
    res.send({Message:"Logged in successful"})
  }
  else{
    res.status(404).send({"message":"user does not Exist"});
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var {username,password}=req.headers;
  var find_user=USERS.find(a=> a.username===username && a.password===password);
  if(find_user){
    res.send(COURSES);
  }
  else{
    res.send({message:"Please Check Login Credentials"});
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var in_id=parseInt(req.params.courseId);
  var {username,password}=req.headers;
  var Finduser=USERS.find(a=>a.username===username && a.password===password)
  var find_course=COURSES.find(a=>a.id===in_id);
  if(Finduser && find_course){
    Finduser.purchasedCourses.push(find_course);
    res.send({message:"Course Purchased Successfully"});
  }
  else{
    res.send({message:"Error in Login or CourseId"});
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var {username,password}=req.headers;
  var user=USERS.find(a=> a.username===username && a.password===password);
  if(user){
    res.send({purchasedCourses:user.purchasedCourses});
  }
  else{
    res.status(404).send("check Your Login Details");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
