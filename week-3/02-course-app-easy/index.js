const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var body = req.body;
  var username = body.username;
  var password = body.password;
  var obj = {
    username,
    password
  }
  ADMINS.push(obj);
  console.log(ADMINS);
  res.send("Admin created successfully");
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var headers = req.headers;
  var username = headers.username;
  var password = headers.password;
  console.log(username,password)
  let user = ADMINS.find((element) => element.username === username)
  console.log(user);
  if(user){
    if(user.password === password){
      res.send("Logged in successfully")
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }
  
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var headers = req.headers;
  var body = req.body;
  var {title, descriptipn, price, imageLink, published} = body;
  var id = Math.floor(Math.random() * 10000)

  var {username, password} = headers;

  var user = ADMINS.find((element) => element.username === username)
  if(user){
    if(user.password === password){
      var obj = {
        id,
        title,
        descriptipn, 
        price, 
        imageLink, 
        published
      }
      COURSES.push(obj);
      res.send({
        message: "Course created Successfully",
        id
      })
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }



});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  var body = req.body;
  var headers = req.headers;
  var {username, password} = headers;


  var user = ADMINS.find((element) => element.username = username)
  if(user){
    if(user.password === password){
      var {title, description, price, imageLink, published} = body;
      var course = COURSES.find((element) => element.id == id);
      if(course){
        course.title = title;
        course.description = description;
        course.price = price;
        course.imageLink = imageLink;
        course.published = published;
        res.send("Course Updated Sucessfully");
    
      }
      else{
        res.status(404).send("Course does not exist");
      }
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }




});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var headers = req.headers;
  var {username, password} = headers


  var user = ADMINS.find((element) => 
    element.username === username
  )
  if(user){
    if(user.password === password){
      res.send(COURSES);
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var body = req.body;
  var username = body.username;
  var password = body.password;
  var obj = {
    username,
    password,
    purchasedCourses : []
  }
  USERS.push(obj);
  res.send("User created successfully")
});

app.post('/users/login', (req, res) => {
  // logic to log in user

  var headers = req.headers;
  var username = headers.username;
  var password = headers.password;
  var user = USERS.find((element) => 
    element.username === username
  )
  if(user){
    if(user.password === password){
      res.send("Logged in successfully")
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses

  var headers = req.headers;
  var username = headers.username;
  var password = headers.password;
  var user = USERS.find((element) => 
    element.username === username
    )
  if(user){
    if(user.password === password){
      res.send(COURSES);
    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var id = parseInt(req.params.courseId);

  var headers = req.headers;
  var username = headers.username;
  var password = headers.password;
  var user = USERS.find((element) =>
    element.username === username
  )
  if(user){
    if(user.password === password){
      var course = COURSES.find((element) => element.id === id);
      if(course){
        user['purchasedCourses'].push(course)
        res.send({
          message: "Course Purchased Successfully"
        })
      }
      else{
        res.status(404).send("Course does not exist");
      }


    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses

  var id = parseInt(req.params.courseId);

  var headers = req.headers;
  var username = headers.username;
  var password = headers.password;
  var user = USERS.find((element) =>
    element.username === username
  )
  if(user){
    if(user.password === password){
      res.send(user['purchasedCourses']);

    }
    else{
      res.status(404).send("invalid password");
    }

  }
  else{
    res.status(404).send("invalid credentials");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
