const express = require('express');
const jwt = require("jsonwebtoken")
const fs = require("fs")
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Token Generator
const salt = "Se3R37u53nam3"
const generateToken = (data) =>
{
  let payload = {username : data.username}
  let token = jwt.sign( payload , salt , { expiresIn : "1h"})
  return token;
}

const authMiddleware = (req ,res, next) =>
{
  let auth = req.headers.authorization
  fs.readFile("as_admins.json" , "utf-8" , (err ,datas) =>
  {
    if(err) throw err;
    if(auth)
    {
      const authtoken = auth.split(" ")[1];
      jwt.verify( authtoken , salt , (err , data) =>
      {
        if(err)
        {
          res.status(404).json({message : "Invalid Token"})
        };
        req.user = datas;
        next()
      })
    }
    else
    {
      res.status(404).json({message : "Login failed"})
    }
  })
}

const authMiddleware_Users = (req ,res, next) =>
{
  let auth = req.body;
  fs.readFile("as_users.json" , "utf-8" , (err ,data) =>
  {
    let da = JSON.parse(data);
    if(err) throw err;
    let check = da.find(t => t.username == auth.username && t.password == auth.password);
    if(check)
    {
      req.user = data;
      next()
    }
    else
    {
      res.status(404).json({message : "Invalid Credentials"})
    }
  })
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  fs.readFile("as_admins.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let admins = JSON.parse(data)
    let check = admins.find(t => t.username == req.body.username)
    if(check)
    {
      res.status(404).json({message : "Username is taken"});
    }
    else
    {
      const newAdmin = req.body;
      admins.push(newAdmin)
      fs.writeFile("as_admins.json" ,JSON.stringify(admins) , (err)=>
      {
        if(err) throw err;
        const token = generateToken(newAdmin)
        res.status(203).json({ message : "You are successfully signed in" , token})
      })
    }
  })
});

app.post('/admin/login', authMiddleware , (req, res) => {
  res.status(200).json({message : "You are logged in successfully"})
});

app.post('/admin/courses', authMiddleware , (req, res) => {
  let get_course = req.body;
  get_course.id = Date.now()
  fs.readFile("as_courses.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let course = JSON.parse(data);
    course.push(get_course);
    fs.writeFile("as_courses.json" , JSON.stringify(course) , (err) =>
    {
      if(err) throw err;
      res.status(200).json({ message: 'Course created successfully', courseId: get_course.id })
    })
  })
});

app.put('/admin/courses/:courseId', authMiddleware , (req, res) => 
{
  let courseID = req.params.courseId;
  let toPush = req.body;
  fs.readFile("as_courses.json" , "utf-8" , (err , data) =>
  {
    let courses = JSON.parse(data);
    let foundIndex = courses.findIndex(t => t.id == courseID)
    courses[foundIndex] = toPush;
    fs.writeFile("as_courses.json" , JSON.stringify(courses) , (err) =>
    {
      if(err) throw err;
      res.status(200).json({ message: 'Course updated successfully' });
    }) 
  })
});

app.get('/admin/courses', authMiddleware , (req, res) => 
{
  fs.readFile("as_courses.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let courses = JSON.parse(data);
    res.status(200).json(courses);
  });
});

// User routes
app.post('/users/signup', (req, res) => {
  let new_user = req.body;
  new_user.purchaseCourse = [];
  fs.readFile("as_users.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let users = JSON.parse(data);
    let check = users.find(t => t.username == new_user.username);
    if(check)
    {
      res.status(404).json({message : "Username is taken"})
    }
    else
    {
      users.push(new_user);
      let token = generateToken(new_user);
      fs.writeFile("as_users.json" , JSON.stringify(users) , (err) =>
      {
        if(err) throw err;
        res.send({ message : "User created successfully" , token})
      })
    }
  })
});

app.post('/users/login', authMiddleware_Users , (req, res) => {
  let user = 
  {
    usename : req.headers.username ,
    password : req.headers.password,
  }
  let token = generateToken(user)
  res.status(200).json({ message: 'Logged in successfully', token})
});

app.get('/users/courses', authMiddleware , (req, res) => {
  fs.readFile("as_courses.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let course = JSON.parse(data);
    let value = course.filter(t => t.published);
    if(value){
      res.status(200).json(value)
    }
    else{
      res.status(400).json({message : "No courses available"});
    }
  })
});

app.post('/users/courses/:courseId', authMiddleware , (req, res) => {
  let courseId = req.params.courseId
  fs.readFile("as_courses.json" , "utf-8" , (err , data) =>
  {
    if(err) throw err;
    let course = JSON.parse(data);
    const checkes = course.find(t => t.id == courseId)
    if(checkes)
    {
      fs.readFile("as_users.json" , "utf-8" , (err , data)=>
      {
        if(err) throw err;
        req.users.purchaseCourse.push(checkes);
        fs.writeFile("as_users.json")
      })
    }
    else
    {
      res.status(404).json({message : "No course found with this id."});
    }
  }) 
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
