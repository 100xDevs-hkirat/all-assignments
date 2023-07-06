const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {writeFile} = require('fs/promises');
const path = require('path')
const app = express();
app.use(express.json());

//##################################################################################################################################################
//BUFFER
let ADMINS = [];
let USERS = [];
let COURSES = [];
let adminSceret="qwerty";
let usersSceret="asdfgh";

//##################################################################################################################################################
//READ FILE
//GET ADMIN DATA IN BUFFER
try
{
  const filepath=path.join(__dirname,'/ADMINS.json');
  const rawdata=fs.readFileSync(filepath,'utf-8');
  ADMINS=JSON.parse(rawdata);
}
catch(err)
{
  console.error("Error occured while retriving ADMIN.\n",err);
}
//GET USER DATA IN BUFFER
try
{
  const filepath=path.join(__dirname,'/USERS.json');
  const rawdata=fs.readFileSync(filepath,'utf-8');
  USERS=JSON.parse(rawdata);
}
catch(err)
{
  console.error("Error occured while retriving USERS.\n",err);
}
//GET COURSE DATA IN BUFFER
try
{
  const filepath=path.join(__dirname,'/COURSES.json');
  const rawdata=fs.readFileSync(filepath,'utf-8');
  COURSES=JSON.parse(rawdata);
}
catch(err)
{
  console.error("Error occured while retriving COURSES.\n",err);
}
//##################################################################################################################################################
//CUSTOM MIDDLEWARE FOR AUTHENTICATION OF ADMINS/USERES AND COURSES

function validateCredentials(req,res,next){
  
  let person =req.path.split('/')[1];   //person is user or admin
  if(req.path.startsWith(`/${person}/signup`)||req.path.startsWith(`/${person}/login`))
    next();
  else
  {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if(person==='admin')
      {
        const credentials = jwt.verify(token, adminSceret);
        req.Admin = ADMINS.find((a)=>a.username===credentials.username)
        next(); 
      }
      else
      {
        const credentials = jwt.verify(token, usersSceret);
        req.User = USERS.find((u)=>u.username===credentials.username)
        next();  
      }
    }catch (err){
      res.status(401).send("Unauthorized");
    }
  }
}

//checks if course exists in database                     [custom middleware]
function validateCourse(req,res,next){
  const {courseId} = req.params;
  let Course = COURSES.find(c=>c.id===courseId)
  if(Course)
  {
    req.Course=Course;
    next();
  }
  else
    res.status(404).send("Course not found")
}

//##################################################################################################################################################
//ADMIN ROUTES

app.post('/admin/signup', (req, res) => {

  //validate incoming data
  const {username,password} =req.body;
  if(!username||!password)
    return res.status(404).send("Please send the complete data.");
  
  //create user
  let newAdmin = {username,password};
  ADMINS.push(newAdmin);
  const filepath=path.join(__dirname,'/ADMINS.json')
  writeFile(filepath,JSON.stringify(ADMINS),'utf-8')
    .then(()=>res.send("Admin created successfully"))
    .catch(()=>res.status(500).send("Internal Server error"))
});

app.post('/admin/login', (req,res)=>{
  const {username,password} = req.headers;    //destructor is used here
  let admin = ADMINS.find((a)=>a.username===username&&a.password===password)
  if(admin)
  {
    const payload = {username};       //making json object from header data
    const options = {expiresIn: '1h'};
    const token = jwt.sign(payload,adminSceret,options);
    res.json({message:"Logged in sucessfully",token: `${token}`});
  }
  else
    res.status(404).send("User not found");
});

app.post('/admin/courses', validateCredentials, (req, res) => {
  //validate incoming data
  const {title,description,price,imageLink,published} = req.body;
  if(!title||!description||!price||!imageLink||!published)
    return res.send("Resend data as it is incomplete");
  let newCourse = {
    id : uuidv4()
  }
  Object.assign(newCourse,req.body);
  COURSES.push(newCourse);
  const filepath=path.join(__dirname,'/COURSES.json')
  writeFile(filepath,JSON.stringify(COURSES),'utf-8')
    .then(()=>res.send(`Course created successfully, courseId: ${newCourse.id}`))
    .catch(()=>res.status(500).send("Internal Server error"))
});

app.put('/admin/courses/:courseId', validateCredentials, validateCourse, (req, res) => {
  //validate incoming data
  const {title,description,price,imageLink,published} = req.body;
  if(!title||!description||!price||!imageLink||published===undefined)
    res.send("Resend data as it is incomplete");
  else
  {
    let {Course} = req;
    Object.assign(Course,req.body);
    const filepath=path.join(__dirname,'/COURSES.json')
    writeFile(filepath,JSON.stringify(COURSES),'utf-8')
      .then(()=>res.send(`Course updated successfully`))
      .catch(()=>res.status(500).send("Internal Server error"))
  }
});

app.get('/admin/courses', validateCredentials, (req, res) => res.json(COURSES));

//##################################################################################################################################################
//USER ROUTES

app.post('/users/signup', validateCredentials, (req, res) => {
    //validate incoming data
    const {username,password} =req.body;
    if(!username||!password)
      return res.status(404).send("Please send the complete data.");
    //create user
    let newUser = {username,password};
    newUser.purchasedCourses = [];
    USERS.push(newUser);
    const filepath=path.join(__dirname,'/USERS.json')
    writeFile(filepath,JSON.stringify(USERS),'utf-8')
      .then(()=>res.send("User created successfully"))
      .catch(()=>res.status(500).send("Internal Server error"))
});

app.post('/users/login', validateCredentials, (req,res)=>{
  const {username,password} = req.headers;    //destructor is used here
  let user = USERS.find((u)=>u.username===username&&u.password===password)
  if(user)
  {
    const payload = {username};       //making json object from header data
    const options = {expiresIn: '1h'};
    const token = jwt.sign(payload,usersSceret,options);
    res.json({message:"Logged in sucessfully",token: `${token}`});
  }
  else
    res.status(404).send("User not found");
});

app.get('/users/courses', validateCredentials, (req,res)=>res.json(COURSES.filter(c=>c.published)) );

app.post('/users/courses/:courseId', validateCredentials, validateCourse, (req, res) => {
  let {User,Course} = req;
  User.purchasedCourses.push(Course.id);
  const filepath=path.join(__dirname,'/USERS.json')
  writeFile(filepath,JSON.stringify(USERS),'utf-8')
    .then(()=>res.send("Course purchased successfully"))
    .catch(()=>res.status(500).send("Internal Server error"))
});

app.get('/users/purchasedCourses', validateCredentials, (req,res)=>res.json(COURSES.filter(c=>req.User.purchasedCourses.includes(c.id))) );

//##################################################################################################################################################
//SERVER IS ON
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
