const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret_key = '33d327d6b6714add6267a1ae3fdfd748489c1636dffa4b57dbc939327186b42d'

const generatejwt=(user)=>{
  const payload = {username:user.username , password:user.password}
  return jwt.sign(payload,secret_key,{expiresIn:'1h'})

}

const authenticateJwt = (req,res,next) =>{
  const authHeaders = req.headers.authorization

  if(authHeaders){
    const token = authHeaders.split(' ')[1];
    // const token = authHeaders;
    jwt.verify(token,secret_key,(err,data)=>{
      if(err){
        res.status(403)
      }
      req.user = data 
      next()
    })
  }
}



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body
  const adminExists = ADMINS.find((a) =>a.username === admin.username)
  if (adminExists){
    res.status(403).send({message:"Admin username already exists"})
  }else{
    ADMINS.push(admin)
    const token = generatejwt(admin)
    // console.log(token)
    res.status(201).send({message:"Admin created successfully", token})
  }

});

app.post('/admin/login',  (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);


  

  if (!admin){
      res.status(403).send({message:"Authentication Failed"})
  }else{
    const token = generatejwt(admin)
      res.send({message:"Admin logged in successfully",token})
  }

});

app.post('/admin/courses', authenticateJwt ,(req, res) => {
  // logic to create a course
  const course = req.body
  course.id = COURSES.length +1

  COURSES.push(course)

  res.send({message:"Course created successfully",courseId:course.id})

});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
    const id = parseInt(req.params.courseId)

    const courseIndex = COURSES.findIndex(c=> c.id === id)
    if(courseIndex != -1){
      const updatedCourse = { ...COURSES[courseIndex], ...req.body };
      COURSES[courseIndex] = updatedCourse
      res.json({message:"Course updated successfully"})
    }else{
      res.status(404).send({message:"Course not found"})
    }

});

app.get('/admin/courses', authenticateJwt ,(req, res) => {
  // logic to get all courses
  res.json({courses:COURSES})

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
 const user =  req.body
 const userExists = USERS.find(u=> u.username === user.username)

 if(userExists){
  res.status(403).send({message:"Username already exists"})
 }else{
  USERS.push(user)
  const token = generatejwt(user)
  res.send({message:"User created successfully",token})
 }

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const user = req.body 
  const userExists = USERS.find(u=> u.username === user.username && u.password === user.password)
  if(userExists !=-1){
    const token = generatejwt(user)
    res.send({message:"User logged in successfully", token})
  }

});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  const publishedCourse = []
  for(let i =0;i<COURSES.length;i++){
    if(COURSES[i].published){
      publishedCourse.push(COURSES[i])
    }
  }
  res.json({courses:publishedCourse})

});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.find(c=>c.id === courseId)
  if (course){
    console.log("req",req)
    const user = USERS.find(u=>u.username === req.user.username)

    if(user){
      if(!user.purchasedCourse){
        user.purhcasedCourse = []
      }else{
        user.purchasedCourse.push(course)
        res.send({message:"Course added successfully", courses: purchasedCourse})
      }
    }else{
      res.status(403).send({message:"User not found"})
    }

  }else{
    res.status(403).send({message:'Course not found'})
  }
});

app.get('/users/purchasedCourses',authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(u => u.username === req.user.username)
  if(user){
    if(user.purchasedCourse!=-1){
      res.status(200).send({courses:user.purchasedCourse})
   }else{
     res.status(200).send({courses:[]})
   }
  }else{
    res.status(403).send({message:"User not found"})
  }

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
