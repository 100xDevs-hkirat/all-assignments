const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const user = { purchasedCourses: 
  [ { 
      id: 1, title: 'course title', 
      description: 'course description',
      price: 100, 
      imageLink: 'https://linktoimage.com',
      published: true 
  }]
}

const authAdmin = (req , res , next ) => {
  const username = JSON.parse(req.headers.username);
  const password = JSON.parse(req.headers.password);

  const found = ADMINS.find(admin => admin.username === username && admin.password === password)

  if(found){
    next()
  } else {
    res.status(401).send()
  }
}

const authUser = (req , res , next )=> {
  const { username , password } = req.headers

  const found = USERS.find(user => user.username === username && user.password === password);

  if(found){
    next();
  } else {
    res.status(401).json( { err: "unauthorized user" } )
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const newAdmin = { 
    username: req.body.username , 
    password: req.body.password
  }

  const userExist = ADMINS.find(admin => admin.username === newAdmin.username && admin.password === newAdmin.password)

  if(userExist){
    res.status(400).send('Admin already exists')
  } else {
    ADMINS.push(newAdmin)
    res.status(201).json({ message: 'Admin created successfully' })
  }
});

app.post('/admin/login', authAdmin , (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: 'Logged in successfully' })
});

app.post('/admin/courses', authAdmin ,(req, res) => {
  // logic to create a course
  const newCourse = {
    id: Math.floor(Math.random() * 100) , 
    title: req.body.title ,
    description: req.body.description ,
    price: req.body.price ,
    imageLink: req.body.imageLink,
    published: req.body.published
  }

  res.status(201).json({ message: 'Course created successfully',
   courseId: newCourse.id })

   COURSES.push(newCourse)
});

app.put('/admin/courses/:courseId', authAdmin ,(req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId)

  const found = COURSES.find(course => course.id === id)
  if(found){
    found.title= req.body.title? req.body.title : found.title ;
    found.description = req.body.description? req.body.description : found.description;
    found.price = req.body.price? req.body.price : found.price;
    found.imageLink = req.body.imageLink? req.body.imageLink : found.imageLink;
    found.published = req.body.published? req.body.published : found.published;
    res.json({msg: "Course Updated"})
  } else {
    res.json({err : "course not found"})
  }
});

app.get('/admin/courses', authAdmin ,(req, res) => {
  // logic to get all courses
  res.json(COURSES)
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  // console.log(req.body)
  
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(newUser)
  res.status(201).json({msg: "user created successfully"})
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const found = USERS.find(user => user.username === req.headers.username && user.password === req.headers.password);
  if(found){
    res.json({ message: 'Logged in successfully' })
  } else {
    res.status(401).send({err: "user not found"})
  }
  
});

app.get('/users/courses' , authUser , (req, res) => {
  // logic to list all courses
  res.json(COURSES)
});

app.post('/users/courses/:courseId', authUser ,(req, res ) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const found = COURSES.find(course => course.id === id)
  if(found){
    req.user.purchasedCourses.push(found)
    res.send({ message: 'Course purchased successfully' })
  } else {
    res.status(400).json({msg: "course not found "})
  }
});

app.get('/users/purchasedCourses', authUser ,(req, res) => {
  // logic to view purchased courses
  res.json({ purchasedCourses : user.purchasedCourses})
});

app.get('/users', (req,res) => {
  res.json(USERS)
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
