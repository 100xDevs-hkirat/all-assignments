const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

app.get("/", (req, res) => {
  res.send("Welcome To Course Selling website");
})



function authenticationMiddleware(req, res, next) {
  const {username, password} = req.headers;
  const admin =  ADMINS.find(a => a.username === username &&  a.password === password);
  if(admin){
    next();
  }else{
    res.status(403).send({"msg" : "Authentication failed"});
  }
}

function authenticationUSERSMiddleware(req, res, next) {

  const {username, password} = req.headers;

  console.log("Username  "+username);
  console.log("password  "+password);

  console.log("USERS 0 => "+ USERS);

  const user =  USERS.find(u => u.username === username &&  u.password === password);

  console.log("USERS 1 => "+ USERS);
  
  if(user){
    next();
  }else{
    res.status(403).send({"msg" : "Authentication failed"});
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  fs.readFile("admin.json", "utf-8", (err, data)=> {
    if(err) throw err;
    ADMINS = JSON.parse(data);
    var newAdmin = {"username" : username, "password": password};
    adminExist = ADMINS.find(admin => admin.username === username);
    if(!adminExist) {
      ADMINS.push(newAdmin);
      fs.writeFile("admin.json", JSON.stringify(ADMINS), (err) => {
        if(err){
          res.send(err);
        }else{
          res.send("ADMIN Created successfully!!!");
        }
      })
    } else {
      res.send("This admin already exist.")
    }
  })
});

app.post('/admin/login', authenticationMiddleware, (req, res) => {
  // logic to log in admin
  const {username, password} = req.body;
  fs.readFile("admin.json", "utf-8", (err, data)=> {
    ADMINS = JSON.parse(data);

    adminIndex =  ADMINS.findIndex(admin => admin.username === req.body.username);
    console.log(adminIndex);
    if(adminIndex !== -1) {
      adminDetails = ADMINS[adminIndex];
      if(adminDetails.username === username && adminDetails.password === password){
        res.status(200).send("Login successful");
      }else{
        res.status(400).send("Login Failed");
      }
    }
  });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const {title, description, price, imageLink, published} = req.body;
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if(err) throw err;
    COURSES = JSON.parse(data);
    const newCourse = { id:COURSES.length +1, title: title, description: description, price: price, imageLink: imageLink, published: published };
    COURSES.push(newCourse);
    fs.writeFile("courses.json", JSON.stringify(COURSES), (err) => {
      if(err) throw err;
      res.status(200).send(  { message: 'Course created successfully', courseId: COURSES.length });
    })
  })
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id  === courseId);
  const courseIndex = COURSES.findIndex(c => c.id  === courseId);
  if(course){
    Object.assign(course, req.body)
    COURSES[courseIndex] = course;
    fs.writeFile("courses.json", JSON.stringify(COURSES), (err) => {
      if(err) throw err;
      res.status(200).json({
        "msg" : "Course updated successfully",
        course
      });
    });
   
  } else {
    res.status(404).send("Course is not available");
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if(err) throw err;
    COURSES = JSON.parse(data);
    res.status(200).send(COURSES);
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if(err) throw err;
    USERS = JSON.parse(data);
    console.log("USERS -> "+USERS);
    const userExist = USERS.find(user => user.username === username)
    var newUser = {
      username : username,
      password : password,
      purchasedCourse : []
    };
    if(!userExist) {
      USERS.push(newUser);
      fs.writeFile("users.json", JSON.stringify(USERS), (err) => {
        if(err) {
          res.status(403).send(`User Failed`);
        }else{
          res.status(200).json({"msg" : `User Signup successfully`, newUser});
        }
      })
    }else{
      res.status(403).send(`User Already Available`);
    }
  })
});

app.post('/users/login',  (req, res) => {
  // logic to log in user
  const {username, password} = req.body;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if(err) throw err;

    USERS = JSON.parse(data);

    console.log("USERS 2  ->>   "+ USERS);

    const userIndex = USERS.findIndex(user => user.username === username);

    if(USERS[userIndex].username === username && USERS[userIndex].password === password){
      console.log("User logged in successfully");
      res.status(200).json({"msg":"User logged in successfully", user : USERS[userIndex]} );
    }else{
      res.status(403).send("Authentication Failed");
    }

  });
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if(err) throw err;
    COURSES = JSON.parse(data);
    const allCourses = COURSES.filter(c => c.published === true);
    res.status(200).send(allCourses);
  })
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course

  const username = req.headers.username;
  const user = USERS.find(user => user.username === username);

  console.log("user  ->>  "+user);

  const courseId = parseInt(req.params.courseId);
  console.log("courseId  ->>  "+courseId);

  fs.readFile("courses.json", "utf-8", (err,data) => {
    if(err) throw err;
    COURSES = JSON.parse(data);
    console.log("COURSES  ->>  "+COURSES);
    const courseIndex = COURSES.findIndex(course => course.id === courseId);
    console.log("courseIndex  ->>  "+courseIndex);

    if(courseIndex !== -1){
      user.purchasedCourse.push(courseId)
      res.json({ message: 'Course purchased successfully', courseId:courseId, user});
    }else{
      res.status(404).json({ message: 'Course not found or not available' });
    }
  })
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses; 
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
