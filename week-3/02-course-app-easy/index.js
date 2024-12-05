const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(express.json());
app.use(bodyParser.json())

let ADMINS = [];
let USERS = [];
let COURSES = [];


const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers
  const admin = ADMINS.find(admin => (admin.username === req.headers.username && admin.password === req.headers.password))
  if (admin) {
    next()
  } else {
    res.status(403).send({ message: 'Admin authentication failed' })
  } 

}


const userAuthentication = (req,res,next) =>{
   const {username,password} = req.headers
   if(USERS.find(user => (user.username === req.headers.username && user.password === req.headers.password))){
    next()
   }else{
    res.status(403).send({message:"User authentication failed"})
   }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body

  if (ADMINS.find(admin => admin.username === req.body.username)) {
    res.status(403).send({ "message": "User exists. Please try with another username" })
  } else {
    ADMINS.push(admin)
    res.send({ message: 'Admin created successfully' })
  }

});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.send({message:"Logged in successfully"})

});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body
  course.id = Date.now()
  
  COURSES.push(course)

  res.send({message:"Course created successfully",courseId:course.id})

});

app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseIndex = COURSES.findIndex(c => c.id === parseInt(req.params.courseId))
  if(courseIndex == -1){
    res.status(404).send({message:"Course doesn't exist"})
  }else{
    COURSES[courseIndex].title = req.body.title
    COURSES[courseIndex].description = req.body.description
    COURSES[courseIndex].price = req.body.price
    COURSES[courseIndex].imageLink = req.body.imageLink
    COURSES[courseIndex].published= req.body.published

    res.send({message:"Course updated successfully"})
  }

});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  // logic to get all courses
  res.send(COURSES)
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = {
    username : req.body.username,
    password : req.body.password,
    purchasedCourse : []
  }
  if (USERS.find(user=> user.username === req.body.username)){
    res.status(403).send({message:"Username Exists"})
  }
  else{
    USERS.push(user)
    res.send({message:"User created successfully"})
  }
});

app.post('/users/login', userAuthentication,(req, res) => {
  // logic to log in user
  res.json({message:"User logged in successfully"})
});

app.get('/users/courses',userAuthentication, (req, res) => {
  // logic to list all courses
   res.send({courses : COURSES})
});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId)
  const course = COURSES.find(course => course.id === courseId && course.published)
  if(course){
    req.user.purchasedCourse.push(courseId)
    res.json({message:'Course purchased successfully'})
  }else{
    res.status(404).send({message:'Course not found or not available'})
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourse
  var purchasedCourses = []

  for (let i =0; i<COURSES.length;i++){
    if(purchasedCourseIds.indexOf((COURSES[i].id !== -1))){
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({purchasedCourses})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
