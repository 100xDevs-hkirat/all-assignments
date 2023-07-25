const express = require('express');
var jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
const secret_key = "json_secretKey"

let ADMINS = [];
let USERS = [];
let COURSES = [];

// function userAuthentication(req, res, next){

//   jwt.verify(token, secretOrPublicKey, [options, callback])

//   next()

// }
//app.use(adminAuthentication)

function generateJwtToken(username){
  token = jwt.sign({username:username,role:"admin"}, secret_key);
  return token
}
function adminAuthentication(req, res, next){
  console.log("in middleware")
  let token=req.headers.authorization.split(" ")[1]
  if(token){
    jwt.verify(token, secret_key,(err,user)=>{
      if(err){
        res.status(403).send()
      }else{
        req.user=user
        next();
      }
    })
  }else{
    res.status(403)
  }
  
}

// - POST /admin/signup
// Description: Creates a new admin account.
// Input: { username: 'admin', password: 'pass' }
// Output: { message: 'Admin created successfully', token: 'jwt_token_here' }
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var token=''
  var flag = false
  const{username, password} = req.body
  function callback(admin){
    if(admin.username===username){
      flag = true
     return flag;
    }
  }
  //check whether the user already exists or not
  let isUserExists = ADMINS.find(callback)
  if(!isUserExists){
    token = generateJwtToken(username)
    let user = {
      username:username,
      password:password,
      id:ADMINS.length+1
    }
    ADMINS.push(user)
    res.status(201).send({
      message:"admin signedup successfully",
      token:token
    })
  }
else{
  res.status(400).send({message: "admin already exists"})
}
});

// - POST /admin/login
// Description: Authenticates an admin. It requires the admin to send username and password in the headers.
// Input: Headers: { 'username': 'admin', 'password': 'pass' }
// Output: { message: 'Logged in successfully', token: 'jwt_token_here' }
app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const{username, password} = req.headers
  function findAdmin(admin){
    if(admin.username === username && admin.password == password){
      return admin
    }
  }
  let adminUser = ADMINS.find(findAdmin)
  if(adminUser){
    token = generateJwtToken(username)
    res.status(200).send({
      message:"login successfull",
      token:token
    })
  }else{
    res.status(403).send({
      message:"Invalid username or password"
    })
  }
});

// POST /admin/courses
//    Description: Creates a new course.
//    Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
//    Output: { message: 'Course created successfully', courseId: 1 }
app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  //let token = req.headers.authorization
  let reqBody = req.body
  //console.log(Object.keys(reqBody).length === 0)
  if(Object.keys(reqBody).length != 0){
    let course = reqBody;
    course.id = COURSES.length+1
    COURSES.push(course)
    res.status(200).send({message:'Course created successfully', courseId:course.id})
  }else{
    res.status(400).send({message:'request body is required'})
  }

});

// - PUT /admin/courses/:courseId
// Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
// Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false }
// Output: { message: 'Course updated successfully' }
app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  let courseId = parseInt(req.params.courseId)
  console.log(courseId)
  let course = COURSES.find((course)=>{ if(course.id === courseId){return course}})
  console.log(course)
  if(course){
    Object.assign(course, req.body)
    res.status(200).send({message:"course updated successfully", course})
  }else{
    res.status(404).send({message:"course not found"})
  }
  
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.status(200).send(COURSES)
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const{username,password} = req.headers;
  let user = USERS.find((user)=>{
    if(user.username===username){
      return user
    }
  })
  if(user){
    res.status(400).send({
      message:"user already exists"})
  }else{
    token = generateJwtToken(username)
    let user= req.body;
    user.id = USERS.length+1
    user.purchasedCourses = []
    USERS.push(user)
    res.status(201).send({
      message:"user has successfully signedup",
      token:token
    })
  }
});

app.post('/users/login', (req, res) => {
  const{username,password}= req.headers
  let user =  USERS.find(user=>user.username===username)
  if(user){
   let token = generateJwtToken(username)
   res.status(200).send({message:"user logged in successfully",token:token})
  }else{
    res.status(404).send("user not found")
  }
  // logic to log in user
});

app.get('/users/courses', adminAuthentication, (req, res) => {
  res.status(200).send(USERS)
  // logic to list all courses
});

app.post('/users/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to purchase a course
  let courseId = parseInt(req.params.courseId)
  let course = COURSES.find(course=>course.id===courseId)
  if(course){
    let user = USERS.find((user)=>{
      if(user.username===req.user.username){
        user.purchasedCourses.push(courseId)
        return user
      }
    })
    if(user){
      res.status(200).send({ message: 'Course purchased successfully' })
    }else{
      res.status(404).send({message: 'user doesnt exists'})
    }
  }else{
    res.status(404).send({
      message:"course not found"
    })
  }
});

app.get('/users/purchasedCourses', adminAuthentication, (req, res) => {
  // logic to view purchased courses
  let username = req.user.username
  let user =USERS.find(user=>user.username===username)
  let purchasedCoursesId = user.purchasedCourses
  let course = COURSES.filter((course)=>{
    return purchasedCoursesId.includes(course.id)
  })
  res.status(200).send(course)
});

app.listen(3003, () => {
  console.log('Server is listening on port 3003');
});
