const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASE = [];

const secretKey = 'your-secret-key';

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const {username,password} = req.body

  if(ADMINS.some(admins => admins.username === username)){
    return res.status(400).send("admin already exist");
  }

  bcrypt.genSalt(10,(err,salt)=>{
    if(err){
      return res.status(500).json({
        message : "error in genrating salt"
      })
     
    }
    bcrypt.hash(password,salt,(err,hash)=>{
      if(err){
        return res.status(500).json({
          message : "error in hashing password"
        })
      }
      const admin={
        username,
        password : hash
      };
      ADMINS.push(admin);
  
      const token = jwt.sign({ username, isAdmin: true }, secretKey, { expiresIn: '1h' });
  
        // Return the token to the client
        res.json({ message: 'Admin created successfully', token });
    })
  
  })

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin

  const { username,password} = req.headers;

  const admin = ADMINS.find(admin=>admin.username===username)
  
  if(!admin || !bcrypt.compareSync(password,admin.password)){
    res.status(401).json({
      message:"Invalid user"
    })
  }

  const token = jwt.sign({username,isAdmin:true},secretKey,{expiresIn:'1h'})

  res.json({
    message:"logged in successfully",
    token
  })
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;

  const token  = req.headers.authorization.split(' ')[1];

  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }

    const course = {
      courseId : Math.floor(Math.random() * 1000000),
      title,
      description,
      price,
      imageLink,
      published
    };
    COURSES.push(course);
    res.status(200).json({
      message : "Course created successfully",
      courseId : course.courseId
    })
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const { title,  price } = req.body;
  const courseId = parseInt(req.params.courseId);

  const token  = req.headers.authorization.split(' ')[1];

  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }


    for (let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].courseId === courseId) {
        adminFlag = true;
        COURSES[i].title = title;
        COURSES[i].price = price;
        break;
      }
    };
    res.status(200).json({
      message : "Course updated successfully",
    })
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }

});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses

  const token  = req.headers.authorization.split(' ')[1];

  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }


 
    res.status(200).json(COURSES)
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username,password} = req.body

  if(USERS.some(users => users.username === username)){
    return res.status(400).send("admin already exist");
  }

  bcrypt.genSalt(10,(err,salt)=>{
    if(err){
      return res.status(500).json({
        message : "error in genrating salt"
      })
     
    }
    bcrypt.hash(password,salt,(err,hash)=>{
      if(err){
        return res.status(500).json({
          message : "error in hashing password"
        })
      }
      const user={
        username,
        password : hash
      };
      USERS.push(user);
  
      const token = jwt.sign({ username, isAdmin: true }, secretKey, { expiresIn: '1h' });
  
        // Return the token to the client
        res.json({ message: 'Admin created successfully', token });
    })
  
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username,password} = req.headers;

  const user = USERS.find(user=>user.username===username)
  
  if(!user|| !bcrypt.compareSync(password,user.password)){
    res.status(401).json({
      message:"Invalid user"
    })
  }

  const token = jwt.sign({username,isAdmin:true},secretKey,{expiresIn:'1h'})

  res.json({
    message:"logged in successfully",
    token
  })
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const token  = req.headers.authorization.split(' ')[1];

  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }

    res.status(200).json(COURSES)
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }

});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const token  = req.headers.authorization.split(' ')[1];
  const courseId = parseInt(req.params.courseId);

  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }
    for(let i=0;i<COURSES.length;i++){
      if(COURSES[i].courseId === courseId){
        PURCHASE.push[COURSES[i]];
        res.status(200).send("couse purchased successfully");
        break;
      }else{
        res.status(403).send("no course with this id")
      }
    }
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const token  = req.headers.authorization.split(' ')[1];
  try{
    const decodetoken = jwt.verify(token,secretKey);
    if(!decodetoken.isAdmin){
      return res.status(401).json({
        message: " Unauthorized"
      })
    }
    res.status(200).json(PURCHASE)
  }catch{
    res.status(401).json({
      message : "Invalid token"
    })
  }
  
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
