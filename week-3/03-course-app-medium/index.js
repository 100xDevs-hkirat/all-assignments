const express = require('express');
const jwt = require("jsonwebtoken");
const fs = require('fs')
const app = express();

app.use(express.json());

function isAdminAuthenticate(req, res , next){

  let token = req.headers.Authorization;
  try {
    let decoded = jwt.verify(token, 'my token key');
    let id = decoded.user_id;
    let isAuth = false;
    fs.readFile('admin.json', 'utf-8', (err, data) => {
      if(err){
        throw err;
      }

      let ADMINS = data.admins;

      for(let i=0; i<ADMINS.length; i++){
        if(ADMINS[i].id === id  ){
          isAuth = true
          req.user = ADMINS[i]
          break;
        }
      }
      if(isAuth){
        next()
      }
  
      else{
        let response = {
          message : "Invalid Credentials"
        }
      
        res.status(401).json(response)
      }

    })
    
  } catch(err) {
    console.log(err)
    res.status(500)
  }
  
}

function isUserAuthenticate(req, res , next){

  let token = req.headers.Authorization;
  try {
    let decoded = jwt.verify(token, 'my token key');
    let id = decoded.user_id;
    let isAuth = false;
    fs.readFile('user.json', 'utf-8', (err, data) => {
      if(err){
        throw err;
      }

      let USERS = data.users

      for(let i=0; i<USERS.length; i++){
        if(USERS[i].id === id  ){
          isAuth = true
          req.user = USERS[i]
          break;
        }
      }
      if(isAuth){
        next()
      }
  
      else{
        let response = {
          message : "Invalid Credentials"
        }
      
        res.status(401).json(response)
      }

    })
    
  } catch(err) {
    console.log(err)
    res.status(500)
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let newAdmin = req.body;
  newAdmin.id = Date.now();


  fs.readFile('admin.json', 'utf-8', (err, data) =>{
    if(err) throw err

    let ADMINS = data.admins

    for(let i=0; i<ADMINS.length ; i++){
      if(ADMINS[i].username === newAdmin.username){
        let response = {
          message : "Admin Already Exist. Please Login"
        }
        res.status(409).json(response)
      }
    }

    ADMINS.push(newAdmin)

    fs.writeFile('admin.json', 'utf-8', (err, data)=> {
      
    })

    try {
      const token = jwt.sign(
        { user_id: newAdmin.id },
        'my token key',
        {
          expiresIn: 200,
        }
      );
  
      let response = {
        message : "Admin created successfully",
        token: token
      }
      res.json(response)
      
    } catch (error) {
      console.log(error)
      res.status(500)
    }


  })

  
  
  
  

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let currUser = req.body;
  for(let i=0; i<ADMINS.length; i++){
    if(ADMINS[i].username === currUser.username  && ADMINS[i].password === currUser.password){
      try {
        const token = jwt.sign(
          { user_id: ADMINS[i].id },
          'my token key',
          {
            expiresIn: 200,
          }
        );
    
        let response = {
          message : "Logged in successfully",
          token: token
        }
        res.json(response)
        
      } catch (error) {
        console.log(error)
        res.status(500)
      }
    }
  }
  
  let response = {
    message : "Invalid Credentials"
  }

  res.status(401).json(response)
  
});


app.post('/admin/courses', isAdminAuthenticate ,(req, res) => {
  // logic to create a course
  let newCourse = req.body
  newCourse.id = Date.now()
  COURSES.push(newCourse)
  
  let response = {
      message : "Course created successfully",
      courseId : newCourse.id
    }
  
  res.json(response)
});


app.put('/admin/courses/:courseId', isAdminAuthenticate, (req, res) => {
  // logic to edit a course
  let editCourse = req.body
  let editCourseId = req.params.courseId
  let isCourseFound = false;

  for(let i=0; i<COURSES.length ; i++){
    if(COURSES[i].id === editCourseId){
      isCourseFound = true;
      if(editCourse.title){
        COURSES[i].title = editCourse.title
      }
      if(editCourse.description){
        COURSES[i].description = editCourse.description
      }
      if(editCourse.price){
        COURSES[i].price = editCourse.price
      }
      if(editCourse.imageLink){
        COURSES[i].imageLink = editCourse.imageLink
      }
      if(editCourse.published){
        COURSES[i].published = editCourse.published
      }
    }
  }

  if(isCourseFound){
    let response = {
      message : "Course updated successfully"
    }
  
    res.json(response)
  }

  else{
    let response = {
      message : "Course not Found"
    }
  
    res.status(404).json(response)
  }
    
    
});

app.get('/admin/courses', isAdminAuthenticate,(req, res) => {
  // logic to get all courses
  let response = {
    courses : COURSES
  }

  res.json(response)
  
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let newUser = req.body;
  newUser.id = Date.now();
  newUser.purchasedCourses = []
  for(let i=0; i<USERS.length ; i++){
    if(USERS[i].username === newAdmin.username){
      let response = {
        message : "User Already Exist. Please Login"
      }
      res.status(409).json(response)
    }
  }
  USERS.push(newUser)
  
  try {
    const token = jwt.sign(
      { user_id: newUser.id },
      'my token key',
      {
        expiresIn: 200,
      }
    );

    let response = {
      message : "User created successfully",
      token: token
    }
    res.json(response)
    
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let currUser = req.body;
  for(let i=0; i<USERS.length; i++){
    if(USERS[i].username === currUser.username  && USERS[i].password === currUser.password){
      try {
        const token = jwt.sign(
          { user_id: USERS[i].id },
          'my token key',
          {
            expiresIn: 200,
          }
        );
    
        let response = {
          message : "Logged in successfully",
          token: token
        }
        res.json(response)
        
      } catch (error) {
        console.log(error)
        res.status(500)
      }
    }
  }
  
  let response = {
    message : "Invalid Credentials"
  }

  res.status(401).json(response)
});

app.get('/users/courses', isUserAuthenticate,(req, res) => {
  // logic to list all courses
  let response = {
    courses : COURSES
  }

  res.json(response)
});


app.post('/users/courses/:courseId', isUserAuthenticate,(req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  let isCourseFound = false;
  let User = req.user

  for(let j=0; j< COURSES.length; j++){
    if(COURSES[j].id === courseId){
        isCourseFound = true;
        User.purchasedCourses.push(COURSES[j]);
    }
  }

  if(!isCourseFound){
    let response = {
      message : "Course not Found"
    }
  
    res.status(404).json(response)
  }

  else{
    let response = {
      message : "Course purchased successfully"
    }
  
    res.json(response)
  }
  
  
  
});


app.get('/users/purchasedCourses', isUserAuthenticate,(req, res) => {
  // logic to view purchased courses
  let response = {
    purchasedCourses : req.user.purchasedCourses
  }

  res.json(response)
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

