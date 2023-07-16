const express = require('express');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { error } = require('console');
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

    if(data.admins){
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

    fs.writeFile('admin.json', JSON.stringify(ADMINS), (err)=> {
      if(err) throw err

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
    }

    else{
      data.admins = []
      data.admins.push(newAdmin)

    fs.writeFile('admin.json', JSON.stringify(data.admins), (err)=> {
      if(err) throw err

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
    }
    
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let currUser = req.body;

  fs.readFile('admin.json', 'utf-8', (err, data) => {

    if(err) throw err

    if(data.admins){
      let ADMINS = data.admins
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
    }
    
  })
  
  
  let response = {
    message : "Invalid Credentials"
  }

  res.status(401).json(response)
  
});


app.post('/admin/courses', isAdminAuthenticate ,(req, res) => {
  // logic to create a course
  let newCourse = req.body
  newCourse.id = Date.now()

  try {

    fs.readFile('course.json', 'utf-8', (err, data) => {
      if(err) throw err
  
      if(data.courses){
        data.courses.push(newCourse)
        fs.writeFile('course.json', JSON.stringify(data.courses), (err)=>{
          if(err) throw err
          
          let response = {
            message : "Course created successfully",
            courseId : newCourse.id
          }
        
          res.json(response)

        })
      }
  
      else{
        data.courses = []
        data.courses.push(newCourse)
        fs.writeFile('course.json', JSON.stringify(data.courses), (err)=>{
          if(err) throw err
          
          let response = {
            message : "Course created successfully",
            courseId : newCourse.id
          }
        
          res.json(response)

        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.put('/admin/courses/:courseId', isAdminAuthenticate, (req, res) => {
  // logic to edit a course
  let editCourse = req.body
  let editCourseId = req.params.courseId
  let isCourseFound = false;

  try {

    fs.readFile('course.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.courses){

        let COURSES = data.courses;

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

        fs.writeFile('course.json', JSON.stringify(COURSES), (err)=>{
          if(err) throw err
        })

      }
    })

    
  } catch (error) {
    console.log(error)
    res.status(500)
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
  try {

    fs.readFile('course.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.courses){
        let response = {
          courses : data.courses
        }
      
        res.json(response)
      }

      else{
        let response = {
          courses : []
        }
      
        res.json(response)
      }
    })
    
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let newUser = req.body;
  newUser.id = Date.now();
  newUser.purchasedCourses = []

  try {

    fs.readFile('user.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.users){
        let USERS = data.users;
        for(let i=0; i<USERS.length ; i++){
          if(USERS[i].username === newAdmin.username){
            let response = {
              message : "User Already Exist. Please Login"
            }
            res.status(409).json(response)
          }
        }
        USERS.push(newUser)

        fs.writeFile('user.json', JSON.stringify(USERS), (err)=>{
          if(err) throw err
        })

      }

      else{
        data.users = []
        data.users.push(newUser);
        
        fs.writeFile('user.json', JSON.stringify(data.users), (err)=>{
          if(err) throw err
        })
      }

    })
    
  } catch (error) {
    console.log(error)
    res.status(500)
  }
  
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

  try {

    fs.readFile('user.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.users){
        let USERS = data.users;
        for(let i=0; i<USERS.length; i++){
          if(USERS[i].username === currUser.username  && USERS[i].password === currUser.password){
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
          }
        }
      }
    })
    
  } catch (error) {
    console.log(error)
    res.status(500)
  }

  let response = {
    message : "Invalid Credentials"
  }

  res.status(401).json(response)
});

app.get('/users/courses', isUserAuthenticate,(req, res) => {
  // logic to list all courses
  try {

    fs.readFile('course.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.courses){
        let response = {
          courses : data.courses
        }
      
        res.json(response)
      }

      else{
        let response = {
          courses : []
        }
      
        res.json(response)
      }
    })
    
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.post('/users/courses/:courseId', isUserAuthenticate,(req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  let isCourseFound = false;
  let User = req.user

  try {
    fs.readFile('course.json', 'utf-8', (err, data) =>{
      if(err) throw err

      if(data.courses){
        let COURSES = data.courses;
        for(let j=0; j< COURSES.length; j++){
          if(COURSES[j].id === courseId){
              isCourseFound = true;
              User.purchasedCourses.push(COURSES[j]);
          }
        }

        fs.readFile('user.json', 'utf-8', (err, data1) =>{
          if(err) throw err

          if(data1.users){
            let USERS = data1.users
            for(let j=0; j< USERS.length; j++){
              if(USERS[j].id === User.id){
                  USERS[j] = User;
              }
            }

            fs.writeFile('user.json', JSON.stringify(USERS), (err)=>{
              if(err) throw err
            })
          } 
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500)
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


app.get('/users/purchasedCourses', isUserAuthenticate, (req, res) => {
  // logic to view purchased courses
  let response = {
    purchasedCourses : req.user.purchasedCourses
  }
  
  res.json(response)
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

