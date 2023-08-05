const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let authMiddleWareAdmin = (req ,res, next) =>
{
  const { username, password } = req.headers;
    let check = ADMINS.find(t => t.username == username && t.password == password)
    if(check == null)
    {
      res.status(404).send("Check username and password")
    }
    else
    {
      next();
    }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
    let admin = req.body;
    let check = ADMINS.find(a => a.username == admin.username)
    if(check == null)
    {
      ADMINS.push(admin);
      res.status(201).json(admin)
    }
    else
    {
      res.status(404).send("Username already exist");
    }
});

app.post('/admin/login', authMiddleWareAdmin , (req, res) => {
  res.status(201).send("LOGIN successful")
});

app.post('/admin/courses', authMiddleWareAdmin , (req, res) => {
  let course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.status(200).send({ message: 'Course created successfully', courseId: course.id}); 
});

app.put('/admin/courses/:courseId', authMiddleWareAdmin , (req, res) => {
  let foundcourse = COURSES.find(i => i.id == req.params.courseId)
  if(foundcourse == null)
  {
    res.send("Cannot find course information")
  }
  else
  {
    Object.assign(foundcourse , req.body)
    res.status(201).json(foundcourse)
  }
});

app.get('/admin/courses', authMiddleWareAdmin , (req, res) => {
  // Input: Headers: { 'username': 'admin', 'password': 'pass' }
  //  Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
  res.status(201).json({ courses : COURSES})
});

let authMiddleWareUser = (req ,res ,next) =>
{
  let {username , password} = req.headers;
  let check = USERS.find(t => t.username == username && t.password == password)
  if(check == null)
  {
    res.status(404).send("Check username and Password")
  }
  else
  {
    req.user = check;
    next();
  }
}

// User routes
app.post('/users/signup', (req, res) => {
  let new_user = {...req.body , purchasedCourses : []};
  // or
  // let new_user = 
  // {
  //   username : req.body.username ,
  //   password : req.body.password ,
  //   purchasedCourses : []
  // }
  let check = USERS.find(t => t.username == req.body.username)
  if(check == null)
  {
    USERS.push(new_user)
    res.status(201).json({ message: 'User created successfully' })
  }
  else
  {
    res.status(404).send("Username is taken")
  }
});

app.post('/users/login', authMiddleWareUser ,(req, res) => {
  res.status(200).json({ message: 'Logged in successfully' })
});

app.get('/users/courses', authMiddleWareUser , (req, res) => {
  let filtered = COURSES.filter(t => t.published) 
  if(filtered)
  {
    res.status(201).json(filtered);
  }
  else{
    res.status(404).send("NO, courses to purchase")
  }
});

app.post('/users/courses/:courseId', authMiddleWareUser , (req, res) => {
  // Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
  //  Input: Headers: { 'username': 'admin', 'password': 'pass' }
  //  Output: { message: 'Course purchased successfully' }
  let courseID = req.params.id;

  let course = COURSES.find(t => t.courseId == courseID && t.published)
  if(course)
  {
    req.user.purchasedCourses.push(course.id);
    res.status(200).json(course)
  }
  else
  {
    res.status(404).send("Course not available")
  }
});

app.get('/users/purchasedCourses', authMiddleWareUser , (req, res) => {
    let purchasedCourseIds = req.user.purchasedCourses.id;
    let purchases = [];
    for (let index = 0; index < COURSES.length; index++)
    {
      if(purchasedCourseIds.indexOf(COURSES[i].id) !== -1){
        purchases.push(COURSES[i])
      }
    }
    res.status(200).json(purchases);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
