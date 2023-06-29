const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASE =[]

// { "title": "course title",
//  "description": "course description",
//  " price": 100,
//    "imageLink": "https://linktoimage.com", 
//    "published": true }

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin= req.body;
  let adminFlag = false;
  for(let i=0;i<ADMINS.length;i++){
    if(ADMINS[i].password === admin.password || ADMINS[i].username === admin.username){
      adminFlag = true;
      break;
    }
  }

  if(adminFlag){
    res.status(404).send("user already exist");
  }else{
    ADMINS.push(admin);
    res.status(200).json({"message":"user created successfully"})
  }
});

app.get('/admin/signup',(req,res)=>{
  res.status(200).json(ADMINS);
})

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const username = req.headers.username;
  const password = req.headers.password;
  loginFlag  = false;
  for(let i=0;i<ADMINS.length;i++){
    if(ADMINS[i].password===password && ADMINS[i].username===username){
      loginFlag = true;
      break;
    }
  }
  if(loginFlag){
    res.status(200).json({
      message: 'Logged in successfully'
    })
  }else{
    res.status(404).send("Wrong Credential")
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const username = req.headers.username;
  const password = req.headers.password;
  adminFlag  = false;
  for(let i=0;i<ADMINS.length;i++){
    if(ADMINS[i].password===password && ADMINS[i].username===username){
      adminFlag = true;
      break;
    }
  }

  if(adminFlag===true){
    const course = req.body;
    course.courseId = Math.floor(Math.random() * 1000000);
    COURSES.push(course);
    res.status(200).json({
      message: 'Course created successfully',
      courseid : course.courseId
    })
  } else{
    res.status(403).json({
    message: 'Access denied. You do not have admin privileges.'
  });
}

});

app.put('/admin/courses/:courseId', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const courseId = parseInt(req.params.courseId);

  const newTitle = req.body.title;
  const newPrice = req.body.price;
  let adminFlag = false;
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].courseId === courseId) {
      adminFlag = true;
      COURSES[i].title = newTitle;
      COURSES[i].price = newPrice;
      break;
    }
  }

  for (let i = 0; i < ADMINS.length; i++) {
    if (ADMINS[i].password === password && ADMINS[i].username === username) {
      adminFlag = true;
      break;
    }
  }

  if (adminFlag) {


      res.status(200).send("Course updated successfully...");
    
  } else {
    res.status(403).json({
      message: 'Access denied. You do not have admin privileges.',
    });
  }
});


app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const username = req.headers.username;
  const password = req.headers.password;
  adminFlag  = false;
  for(let i=0;i<ADMINS.length;i++){
    if(ADMINS[i].password===password && ADMINS[i].username===username){
      adminFlag = true;
      break;
    }
  }
  if(adminFlag){
    res.status(200).json(COURSES);
  }else{
    res.status(403).json({
      message: 'Access denied. You do not have admin privileges.',
    });
  }

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user= req.body;
  let userFlag = false;
  for(let i=0;i<USERS.length;i++){
    if(USERS[i].password === user.password || USERS[i].username === user.username){
      userFlag = true;
      break;
    }
  }

  if(userFlag){
    res.status(404).send("user already exist");
  }else{
    USERS.push(user);
    res.status(200).json({"message":"user created successfully"})
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const username = req.headers.username;
  const password = req.headers.password;
  loginFlag  = false;
  for(let i=0;i<USERS.length;i++){
    if(USERS[i].password===password && USERS[i].username===username){
      loginFlag = true;
      break;
    }
  }
  if(loginFlag){
    res.status(200).json({
      message: 'Logged in successfully'
    })
  }else{
    res.status(404).send("Wrong Credential")
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const username = req.headers.username;
  const password = req.headers.password;
  loginFlag  = false;
  for(let i=0;i<USERS.length;i++){
    if(USERS[i].password===password && USERS[i].username===username){
      loginFlag = true;
      break;
    }
  }
  if(loginFlag){
    res.status(200).send(COURSES)
  }else{
    res.status(404).send("You are not registered Users")
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const username = req.headers.username;
  const password = req.headers.password;
  const courseId = parseInt(req.params.courseId);
  let loginFlag  = false;
  for(let i=0;i<USERS.length;i++){
    if(USERS[i].password===password && USERS[i].username===username){
      loginFlag = true;
      break;
    }
  }

  if(loginFlag){
    for(let i=0;i<COURSES.length;i++){
      if(COURSES[i].courseId === courseId){
        PURCHASE.push[COURSES[i]];
        res.status(200).send("couse purchased successfully");
        break;
      }else{
        res.status(403).send("no course with this id")
      }
    }
  }else{
    res.status(404).send("Bad Request")
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  res.status(200).send(PURCHASE)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
