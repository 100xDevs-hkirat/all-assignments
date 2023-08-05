const express = require('express');
const jwt = require("jsonwebtoken")
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const salt = "gen3tok3n2mnk"
let generateToken = (data) =>
{
  let payload = {username : data.username}
  let token = jwt.sign(payload , salt , {expiresIn : `1h`})
  return token;
}

let authMidddleWare = (req ,res, next) =>
{
  let authToken = req.headers.authorization;
  if(authToken)
  {
    const authtokenarr = authToken.split(" ")[1];
    jwt.verify( authtokenarr , salt , (err , data) =>
    {
      if(err) throw err;
      req.user = data;
      next()
    })
  }
  else
  {
    res.status(404).json({message : "Authorization failed"});
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  let user = req.body;
  let check = ADMINS.find(t => t.username == user.username)
  if(check)
  {
    res.status(404).json({message : "Admin already exists"})
  }
  else
  {
    let token = generateToken(user)
    res.status(200).json({message : "Signed Up successfully" , token})
  }
});

app.post('/admin/login', authMidddleWare , (req, res) => {
  res.status(200).json({message : "You are logged in successfully"})
});

app.post('/admin/courses', authMidddleWare , (req, res) => {
  // Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
  // { message: 'Course created successfully', courseId: 1 }
  let new_course = req.body;
  new_course.id = Date.now();
  COURSES.push(new_course);
  res.status(201).json({message : "Course created successfully" , courseId : new_course.id});
});

app.put('/admin/courses/:courseId', authMidddleWare , (req, res) => {
    let courseID = req.params.courseId;
    let updatedCourse = req.body;
    updatedCourse.id = req.params.courseId;
    let courseIndex = COURSES.findIndex(t => t.id == courseID)
    if(courseIndex != -1)
    {
      COURSES[courseIndex] = updatedCourse;
      res.status(200).json(updatedCourse);
    }
});

app.get('/admin/courses', authMidddleWare , (req, res) => {
  res.status(200).json(COURSES)
});

// User routes
app.post('/users/signup', (req, res) => {
  // Description: Creates a new user account.
  // Input: { username: 'user', password: 'pass' }
  // Output: { message: 'User created successfully', token: 'jwt_token_here' }
  let new_user = {...req.body , purchasedCourses : []};
  let check = USERS.find(t => t.username == req.body.username)
  if(check)
  {
    res.status(404).json({message : "Username is taken"})
  }
  else
  {
    USERS.push(new_user)
    let token = generateToken(new_user)
    res.status(203).json({message : "Signed Up successfully" , token} )
  }
});

app.post('/users/login', authMidddleWare , (req, res) => {
    res.status(200).json({message : "You aare logged in successfully"})
});

app.get('/users/courses', authMidddleWare , (req, res) => {
  let check = COURSES.filter(t => t.published)
  if(check)
  {
    res.status(200).json(check)
  }
  else
  {
    res.status(404).json({message : "No courses available"});
  }
});

app.post('/users/courses/:courseId', authMidddleWare , (req, res) => {
  // Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
  //  Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }
  //  Output: { message: 'Course purchased successfully' }
  let courseID = req.params.courseId;
  let foundCourse = COURSES.find(t => t.id == courseID)
  if(foundCourse)
  {
    req.user.purchasedCourses.push(foundCourse);
    res.status(200).json(foundCourse)
  }
  else
  {
    res.status(404).json({message : "Unable to purchase courses"})
    
  }
});

app.get('/users/purchasedCourses', authMidddleWare , (req, res) => {
    res.status(200).json(purchasedCourses)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
