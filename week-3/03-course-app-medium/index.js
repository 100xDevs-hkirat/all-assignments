require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

app.use(express.json());

// Admin routes
app.post('/admin/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //ADMINS.push({username,password});
  readFile('./files/admins.txt').then((data) => {
    const ADMINS = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    ADMINS.push({username,password});
    writeFile('./files/admins.txt', JSON.stringify(ADMINS)).then((err) => {
      if(!err) return res.send('Admin created successfully');
    });
  });
});

app.post('/admin/login', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  
  readFile('./files/admins.txt').then((data) => {
    const ADMINS = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    if(ADMINS.some((admin) => admin.username === username && admin.password === password)){
      const accessToken = generateAccessToken({username});
      res.json({ message: 'Logged in successfully', token: accessToken });
    }else{
      res.status(401).send("Invalid credentials");
    }
  });
  
});

app.post('/admin/courses', validateAuthToken, (req, res) => {
  const { title, description,  price, imageLink, published } = req.body;
  const id = crypto.randomUUID();
  //COURSES.push({ id, title, description,  price, imageLink, published });
  readFile('./files/courses.txt').then((data) => {
    const COURSES = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    COURSES.push({ id, title, description,  price, imageLink, published });
    writeFile('./files/courses.txt', JSON.stringify(COURSES)).then((err) => {
      if(!err) return res.json({ message: 'Course created successfully', courseId: id });
    });
  });
});

app.put('/admin/courses/:courseId', validateAuthToken, (req, res) => {
  const courseId = req.params.courseId;
  const { title, description,  price, imageLink, published } = req.body;

  readFile('./files/courses.txt').then((data) => {
    const COURSES = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    let course = COURSES.find(course => course.id === courseId);
  
    if(course === undefined){
      res.status(404).send('Invalid course id');
      return;
    }

    Object.assign(course, { title, description,  price, imageLink, published });
    writeFile('./files/courses.txt', JSON.stringify(COURSES)).then((err) => {
      if(!err) return res.send('Course updated successfully');
    });
    
  });
});

app.get('/admin/courses', validateAuthToken, (req, res) => {
  readFile('./files/courses.txt').then((data) => {
    const COURSES = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    res.json({courses:COURSES});
  });
});

// User routes
app.post('/users/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  readFile('./files/users.txt').then((data) => {
    const USERS = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    USERS.push({username,password});
    writeFile('./files/users.txt', JSON.stringify(USERS)).then((err) => {
      if(!err) return res.send('User created successfully');
    });
  });
});

app.post('/users/login', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  readFile('./files/users.txt').then((data) => {
    const USERS = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    if(USERS.some((user) => user.username === username && user.password === password)){
      const accessToken = generateAccessToken({username});
      res.json({ message: 'Logged in successfully', token: accessToken });
    }else{
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get('/users/courses', validateAuthToken, (req, res) => {
  readFile('./files/courses.txt').then((data) => {
    const COURSES = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
    res.json({courses:COURSES});
  });
});

app.post('/users/courses/:courseId', validateAuthToken, (req, res) => {
  const courseId = req.params.courseId;
  const username = req.payload.username;

  readFile('./files/purchasedcourses.txt').then((data) => {
    const purchasedCourses = (data === undefined || data === null || data == '') ? new Map() : new Map(JSON.parse(data));
    readFile('./files/courses.txt').then((data) => {
      const COURSES = (data === undefined || data === null || data == '') ? [] : JSON.parse(data);
      if(!purchasedCourses.has(username)){
        purchasedCourses.set(username,[]);
      }
      const course = COURSES.find(course => course.id === courseId);
      purchasedCourses.get(username).push(course);
      writeFile('./files/purchasedcourses.txt', JSON.stringify([... purchasedCourses])).then((err) => {
        if(!err) return res.json({ message: 'Course purchased successfully' });
      });
    });
  });
});


app.get('/users/purchasedCourses', validateAuthToken, (req, res) => {
  const payload = req.payload;
  const username = payload.username;
  readFile('./files/purchasedcourses.txt').then((data) => {
    const purchasedCourses = (data === undefined || data === null || data == '') ? new Map() : new Map(JSON.parse(data));
    res.json({purchasedCourses : purchasedCourses.get(username)});
    
  });
});

function validateAuthToken(req, res, next){
  const authHeader = req.headers.authorization;
  const authToken = authHeader && authHeader.split(' ')[1];
  if(authToken === null) return res.status(401).send("Invalid user");

  jwt.verify(authToken, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
    if(err) return res.send('Invalid Token').status(403);
    req.payload = payload;
    next();
  })
}

function generateAccessToken(payload){
  return jwt.sign(payload,process.env.ACCESS_SECRET_TOKEN, {expiresIn: '2m'});
}

function readFile(filepath){
  return new Promise((resolve) => {
    fs.readFile(filepath,'utf8', (err, data) => {
      resolve(data);
    })
  })
}

function writeFile(filepath, data){
  return new Promise((resolve) => {
    fs.writeFile(filepath,data, (err) => {
      resolve(err);
    })
  })
}

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
