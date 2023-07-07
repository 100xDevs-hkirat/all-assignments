require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];



const generateJwtAdmin = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_ADMIN, {expiresIn : '1h'});
  return accessToken

}

const authenticateJwtAdmin = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN, (err, user) => {
    if(err) throw err;
    if(user){
      req.user = user
      next();
      
    }
    else{
      res.send("Unable to log in");
    }
  })

}


const generateJwtUser = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_USER, {expiresIn : '1h'});
  return accessToken

}

const authenticateJwtUser = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER, (err, user) => {
    if(err) throw err;
    if(user){
      req.user = user
      next();
      
    }
    else{
      res.send("Unable to log in");
    }
  })

}


// const adminAuthentication = (req,res, next) => {
//   var headers = req.headers;
//   var username = headers.username;
//   var password = headers.password;
//   let user = ADMINS.find((element) => element.username === username)
//   if(user){
//     if(user.password === password){
//       next();
//     }
//     else{
//       res.status(404).send("invalid password");
//     }

//   }
//   else{
//     res.status(404).send("invalid credentials");
//   }

// }


// const userAuthentication = (req,res,next) => {

//   var headers = req.headers;
//   var username = headers.username;
//   var password = headers.password;
//   var user = USERS.find((element) => 
//     element.username === username
//   )
//   if(user){
//     if(user.password === password){
//       next();
//     }
//     else{
//       res.status(404).send("invalid password");
//     }

//   }
//   else{
//     res.status(404).send("invalid credentials");
//   }

// }

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
 const obj = req.body;
 const existingAdmin = ADMINS.find((element) => element === obj);
 if(existingAdmin) {
  res.send({message: "Admin already exists"});
 }

else{
  const accessToken = generateJwtAdmin(obj);
  ADMINS.push(obj);
  console.log(ADMINS);
  res.send({
    message : "User Signed Successfully",
    accessToken,
  });
}
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
const {username, password} = req.headers;
  let user = ADMINS.find((element) => element.username === username && element.password === password)
  if(user){
    const accessToken = generateJwtAdmin(user);
    res.send({message:"Admin Logged in successfully", accessToken});
  }
  else{
    res.status(404).send("invalid credentials");
  }  
});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  var body = req.body;
  var {title, descriptipn, price, imageLink, published} = body;
  var id = Math.floor(Math.random() * 10000)


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
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  var body = req.body;
  var {title, description, price, imageLink, published} = body;
  var course = COURSES.find((element) => element.id == id);
  if(course){
    Object.assign(course,body);
    res.send("Course Updated Sucessfully");

  }
  else{
    res.status(404).send("Course does not exist");
  }




});

app.get('/admin/courses',authenticateJwtAdmin, (req, res) => {
  // logic to get all courses
  res.send(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user



  const {username, password} =  req.body;

  const user = USERS.find((element) => element.username === username && element.password === password)
  if(user){
    res.send("User already exists");
  } 

  else{
  var obj = {
    username,
    password,
    purchasedCourses : []
  }
  USERS.push(obj);
  accessToken = generateJwtUser({username, password});
  res.send({message : "User created successfully", accessToken})
}
});

app.post('/users/login', (req, res) => {


  const {username, password} = req.headers;
  var user = USERS.find((element) => 
    element.username === username && element.password === password
  )
  if(user){
    accessToken = generateJwtUser(user);
    res.send("User logged in successfully");
  }
  else{
    res.status(404).send("invalid credentials");
  }
  // logic to log in user
  


});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  // logic to list all courses
  res.send(COURSES);
});

app.post('/users/courses/:courseId',authenticateJwtUser, (req, res) => {
  // logic to purchase a course
  var id = parseInt(req.params.courseId);
  var username = req.user.username;
  var user = USERS.find((element) =>
    element.username === username
  )
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


});

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
  // logic to view purchased courses
  var username = req.user.username;
  var user = USERS.find((element) =>
    element.username === username
  )
  res.send(user['purchasedCourses']);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});