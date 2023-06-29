const express = require('express');
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());


// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// Helping functions
function authenticate(obj,db){

  for(let i=0;i<db.length;i++){
    if(obj.username===db[i].username){
      if(obj.password===db[i].password){
        return true;
      }
    }
  }
}

function findId(id,db){
  for(let i=0;i<db.length;i++){
    if(id==db[i].id){
      return i;
    }
  }
  return -1;
}




// ADMIN SIGNUP
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var admin = {
    username: req.headers.username,
    password: req.headers.password

  };
fs.readFile("admins.json","utf8",(err,data)=>{
    if(err) throw err;

    const dbAdmin = JSON.parse(data);
    dbAdmin.push(admin);

fs.writeFile("admins.json",JSON.stringify(dbAdmin),(err)=>{
      if(err) throw err;
      res.json({ message: 'Admin created successfully' });
    });
  });
});


// ADMIN LOGIN
app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("admins.json","utf8",(err,data)=>{
    if(err) throw err;
    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(auth){
      res.json({ message: 'Logged in successfully' });
    }
    else{
      res.status(404).send("Not Autherized.");
    }
  })
});


// ADMIN CREATE COURSES
app.post('/admin/courses', (req, res) => {
  // logic to create a course

  var logger = {
    username: req.headers.username,
    password: req.headers.password

  };
  
fs.readFile("admins.json","utf8",(err,data)=>{
    if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Autherized.");

    const course = {
      "title": req.body.title, 
      "description": req.body.description, 
      "price": req.body.price, 
      "imageLink": req.body.imageLink, 
      "published": req.body.published,
      "id": Math.floor(Math.random() * 1000000)
    }
fs.readFile("courses.json","utf8",(err,data)=>{
      if(err) throw err;
      const dbCourses = JSON.parse(data);
      dbCourses.push(course);
fs.writeFile("courses.json",JSON.stringify(dbCourses),(err)=>{
    if(err) throw err;
    res.json({ message: 'Course created successfully', courseId: course.id });
})
    });
  });
});


// ADMIN UPDATES COURSES
app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var logger = {
    username: req.headers.username,
    password: req.headers.password

  };
  var id = parseInt(req.params.courseId);
  
fs.readFile("admins.json","utf8",(err,data)=>{
    if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Autherized.");

    const course = {
      title: req.body.title, 
      description: req.body.description, 
      price: req.body.price, 
      imageLink: req.body.imageLink, 
      published: req.body.published,
      id: id
    }
    
fs.readFile("courses.json","utf8",(err,data)=>{
      const dbCourses = JSON.parse(data);
      let cindex = findId(id,dbCourses);
      if(cindex==-1) res.status(404).send("Course Not Found");
      
      dbCourses[cindex] = course;
      fs.writeFile("courses.json",JSON.stringify(dbCourses),(err)=>{
        if(err) throw err;
        res.json({ message: 'Course updated successfully' });
      })
    })
    
});
});


// GET ALL COURSES
app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("admins.json","utf8",(err,data)=>{
  if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Autherized.");

fs.readFile("courses.json","utf8",(err,data)=>{
  const dbCourses = JSON.parse(data);
  res.send(dbCourses);
})
})
});


//USER


// USER SIGNUP
app.post('/users/signup', (req, res) => {
  // logic to sign up admin
  var user = {
    username: req.headers.username,
    password: req.headers.password

  };
fs.readFile("users.json","utf8",(err,data)=>{
    if(err) throw err;

    const dbUsers = JSON.parse(data);
    dbUsers.push(user);

fs.writeFile("users.json",JSON.stringify(dbUsers),(err)=>{
      if(err) throw err;
      res.json({ message: 'User created successfully' });
    });
  });
});



app.post('/users/login', (req, res) => {
  // logic to log in admin
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("users.json","utf8",(err,data)=>{
    if(err) throw err;
    const dbUsers = JSON.parse(data);
    const auth = authenticate(logger,dbUsers);
    if(auth){
      res.json({ message: 'Logged in successfully' });
    }
    else{
      res.status(404).send("Not Registered, please SignUp.");
    }
  });
});



app.get('/users/courses', (req, res) => {
  // logic to get all courses
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("admins.json","utf8",(err,data)=>{
  if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Autherized.");

fs.readFile("courses.json","utf8",(err,data)=>{
  const dbCourses = JSON.parse(data);
  res.send(dbCourses);
})
});
});



app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var purchaseId = parseInt(req.params.courseId);
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("admins.json","utf8",(err,data)=>{
  if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Registered, please SignUp.");
  
fs.readFile("courses.json","utf8",(err,data)=>{
  if(err) throw err;

  const dbCourses = JSON.parse(data);
  const corId = findId(purchaseId,dbCourses);
  const purchasedCourse = dbCourses[corId];

fs.readFile("purchased.json","utf8",(err,data)=>{
  if(err) throw err;

  const dbPurchased = JSON.parse(data);
  dbPurchased.push(purchasedCourse);

fs.writeFile("purchased.json",JSON.stringify(dbPurchased),(err)=>{
  if(err) throw err;
  res.json({ message: 'Course purchased successfully' });

})
  });
});
  });
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to get all courses
  var logger = {
    username: req.headers.username,
    password: req.headers.password
  };

fs.readFile("admins.json","utf8",(err,data)=>{
  if(err) throw err;

    const dbAdmin = JSON.parse(data);
    const auth = authenticate(logger,dbAdmin);
    if(!auth) res.status(404).send("Not Autherized.");

fs.readFile("purchased.json","utf8",(err,data)=>{
  const dbPurchased = JSON.parse(data);
  res.send(dbPurchased);
})
});
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
