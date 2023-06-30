const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());

//let ADMINS = [];
//let USERS = [];
//let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var user = req.body;
  var already_exist = false;
  fs.readFile('admin.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let ADMINS = JSON.parse(data);
    for (var i =0; i < ADMINS.length; i++){
      if(ADMINS[i].username === user.username){
        already_exist = true;
        break;
      }
    }
    if(already_exist){
      res.statusCode(400);
    }else{
      ADMINS.push(user);
      fs.writeFile('admin.json', JSON.stringify(ADMINS),(err)=>{
        if(err) throw(err);
        res.send({message: "Admin created successfully"});
      });
      
    };
  });
  
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  fs.readFile('admin.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let ADMINS = JSON.parse(data);
    for (var i =0; i < ADMINS.length; i++){
      if(ADMINS[i].username === username && ADMINS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      res.statusCode(200).send({message: "Logged in successfully"});
    }else{
      res.statusCode(401);
      
    };
  });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var username = req.headers.username;
  var password = req.headers.password
  var course = req.body;
  var valid_user = false;
  fs.readFile('admin.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let ADMINS = JSON.parse(data);
    for (var i =0; i < ADMINS.length; i++){
      if(ADMINS[i].username === username && ADMINS[i].password === password){
        valid_user = true;
        break;
      }
    }
    var new_course = {
    title: course.title,
    description: course.description,
    price: course.price,
    imageLink: course.imageLink,
    published: course.published,
    id: Math.floor(Math.random() * 1000000)
  }

    if(valid_user){
      fs.readFile('course.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let COURSES = JSON.parse(data);
        COURSES.push(new_course)
      fs.writeFile('course.json', JSON.stringify(COURSES), (err)=>{
        if (err) throw err;
        res.statusCode(200).send({message: "Course created successfully"});
      })
        
      })
    }else{
      res.statusCode(401);
      
    };
  });
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var username = req.headers.username;
  var password = req.headers.password;
  var course = req.body;
  var courseID = parseInt(req.params.courseId)
  var valid_user = false;
  fs.readFile('admin.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let ADMINS = JSON.parse(data);
    for (var i =0; i < ADMINS.length; i++){
      if(ADMINS[i].username === username && ADMINS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      fs.readFile('course.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let COURSES = JSON.parse(data);
        for(var i =0; i < COURSES.length; i++){
      
          if( COURSES[i].id === courseID ){
             COURSES[i].id = course.id;
             COURSES[i].title = course.title;
             COURSES[i].description = course.description;
             COURSES[i].price = course.price;
             COURSES[i].imageLink = course.imageLink;
             COURSES[i].published = course.published;
             
          }
        }
      fs.writeFile('course.json', JSON.stringify(COURSES), (err)=>{
        if(err) throw(err);
        res.send({message: "Course updated successfully"})
      })
      })
    } else{
      res.statusCode(401);
    }
  });
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var username = req.headers.username;
  var password = req.headers.password;
  var valid_user = false;
  fs.readFile('admin.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let ADMINS = JSON.parse(data);
    for (var i =0; i < ADMINS.length; i++){
      if(ADMINS[i].username === username && ADMINS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      fs.readFile('course.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let COURSES = JSON.parse(data);
        res.json({courses: COURSES});
      })
    } else{
      res.statusCode(401);
    }
  });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var user = req.body;
  var already_exist = false;
  fs.readFile('user.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let USERS = JSON.parse(data);
    for (var i =0; i < USERS.length; i++){
      if(USERS[i].username === user.username){
        already_exist = true;
        break;
      }
    }
    if(already_exist){
      res.statusCode(400);
    }else{
      var new_user_data = {};
      new_user_data = {
      username: user.username,
      password: user.password,
      purchasedCourses: []
    }
      USERS.push(new_user_data);
      fs.writeFile('user.json', JSON.stringify(USERS),(err)=>{
        if(err) throw(err);
        res.send({message: "Logged in successfully"});
      });
      
    };
  });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  fs.readFile('user.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let USERS = JSON.parse(data);
    for (var i =0; i < USERS.length; i++){
      if(USERS[i].username === username && USERS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      res.statusCode(200).send({message: "Logged in successfully"});
    }else{
      res.statusCode(401);
      
    };
  });

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  fs.readFile('user.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let USERS = JSON.parse(data);
    for (var i =0; i < USERS.length; i++){
      if(USERS[i].username === username && USERS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      fs.readFile('course.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let COURSES = JSON.parse(data);
        res.json({courses: COURSES});
      })
    }else{
      res.statusCode(401); 
    };
  });
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var username = req.headers.username;
  var password = req.headers.password
  var courseID = parseInt(req.params.courseId)
  var valid_user = false;
  fs.readFile('user.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let USERS = JSON.parse(data);
    for (var i =0; i < USERS.length; i++){
      if(USERS[i].username === username && USERS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      fs.readFile('course.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let COURSES = JSON.parse(data);
        for (var i =0; i < COURSES.length; i++){
          if( COURSES[i].id === courseID ){
            for (var j =0; j < USERS.length; j++){
              if(username === USERS[j].username){
                USERS[j].purchasedCourses.push(COURSES[i]);
                res.send({message: "Course purchased successfully"});
              }
            }
          }
        }
      })
    }else{
      res.statusCode(401); 
    };
  });

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  fs.readFile('user.json', 'utf-8', (err, data)=>{
    if (err) throw(err);
    let USERS = JSON.parse(data);
    for (var i =0; i < USERS.length; i++){
      if(USERS[i].username === username && USERS[i].password === password){
        valid_user = true;
        break;
      }
    }
    if(valid_user){
      fs.readFile('user.json', 'utf-8', (err, data)=>{
        if(err) throw (err);
        let USERS = JSON.parse(data);
        for(var i =0; i<USERS.length; i++){
          if(username === USERS[i].username){
            res.json({purchasedCourses: USERS[i].purchasedCourses})
          }
        }
      })
    }else{
      res.statusCode(401); 
    };
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
