const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

//##################################################################################################################################################

let ADMINS = [];
let USERS = [];
let COURSES = [];

//##################################################################################################################################################

//checks if user(admin or user) exits in the database     [custom middleware]
function validateCredentials(req,res,next){
  const {username,password} = req.headers;
  let User;
  if(req.path.startsWith('/admin/'))
    User=ADMINS.find(admin=>admin.username===username&&admin.password===password);
  else
    User=USERS.find(user=>user.username===username&&user.password===password);
  if(User)
  {
    req.User=User;
    next();
  }
  else
    res.status(404).send("Invalid credentails")
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

// Admin routes
app.post('/admin/signup', (req, res) => {

  //validate incoming data
  const {username,password} =req.body;
  if(!username||!password)
    return res.status(404).send("Please send the complete data.");
  
  //create user
  try{
    let newAdmin = {username,password};
    ADMINS.push(newAdmin);
    return res.send("Admin created successfully");
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).send("Internal Server error");
  }
});

app.post('/admin/login', validateCredentials, (req,res)=>res.send("Logged in sucessfully") );

app.post('/admin/courses', validateCredentials, (req, res) => {
  //validate incoming data
  const {title,description,price,imageLink,published} = req.body;
  if(!title||!description||!price||!imageLink||!published)
    return res.send("Resend data as it is incomplete");
  let newCourse = {
    id : uuidv4(),
    title,
    description,
    price,
    imageLink,
    published
  }
  COURSES.push(newCourse);
  return res.send(`Course created successfully, courseId: ${newCourse.id}`);
});

app.put('/admin/courses/:courseId', validateCredentials, validateCourse, (req, res) => {
  //validate incoming data
  const {title,description,price,imageLink,published} = req.body;
  if(!title||!description||!price||!imageLink||published===undefined)
    res.send("Resend data as it is incomplete");
  else
  {
    let {Course} = req;
    Course.title = title;
    Course.description = description;
    Course.price = price;
    Course.imageLink = imageLink;
    Course.published = published;
    res.send("Course update successfully");
  }
});

app.get('/admin/courses', validateCredentials, (req, res) => res.json(COURSES));

//##################################################################################################################################################

// User routes
app.post('/users/signup', (req, res) => {
    //validate incoming data
    const {username,password} =req.body;
    if(!username||!password)
      return res.status(404).send("Please send the complete data.");
    //create user
    try{
      let newUser = {username,password};
      newUser.purchasedCourses = [];
      USERS.push(newUser);
      return res.send("User created successfully");
    }
    catch(err)
    {
      console.log(err);
      return res.status(500).send("Internal Server error");
    }
});

app.post('/users/login', validateCredentials, (req,res)=>res.send("Logged in sucessfully") );

app.get('/users/courses', validateCredentials, (req,res)=>res.json(COURSES) );

app.post('/users/courses/:courseId', validateCredentials, validateCourse, (req, res) => {
  let {Course,User} = req;
  User.purchasedCourses.push(Course);
  res.send("Course purchased successfully");
});

app.get('/users/purchasedCourses', validateCredentials, (req,res)=>res.json(req.User.purchasedCourses) );

//##################################################################################################################################################

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
