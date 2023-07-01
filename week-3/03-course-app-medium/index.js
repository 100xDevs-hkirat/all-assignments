const express = require("express");
const app = express();
const { Admin, Course , User} = require("./models/");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const fs = require("fs")
const config = require("config");
const path = require("path");

app.use(express.json());

//Path to data storing files
let ADMINS = path.join(__dirname,"/db/ADMINS.json");
let USERS = path.join(__dirname,"/db/USERS.json");
let COURSES = path.join(__dirname,"/db/COURSES.json");

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;
  
  //Fetching data from ADMINS.json file
  fs.readFile(ADMINS,"utf-8",(err,data)=>{
    if(err) throw err;
    let Admins = JSON.parse(data);
    
    //Check if username/email already taken
    const checkTaken = Admins.find((admin) => admin.username === username);
    if (checkTaken) {
      return res.json({ msg: "Username / Email already taken" });
    }
    const newAdmin = new Admin(username, password);
    Admins.push(newAdmin.getDetails());

    //Writing to ADMINS.json file to add new admin
    fs.writeFile(ADMINS,JSON.stringify(Admins),"utf-8",(err)=>{
      if(err) throw err;
      const payload = { user: newAdmin.getDetails().id };
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: "1d" },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
          }
        );
    })
  })
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;

  fs.readFile(ADMINS,"utf-8",(err,data)=>{
    if(err) throw err;
    const Admins = JSON.parse(data);

    //Check if user is registered
    const admin = Admins.find((admin) => admin.username === username);
    if (!admin) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    if (admin.password === password) {
      const payload = { user: admin.id };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    }
  })
});

app.post("/admin/courses", auth, (req, res) => {

  const {title, description, price, imgLink, published} = req.body;

  //Fetching data from COURSES.json file
  fs.readFile(COURSES,"utf-8",(err,data)=>{
    
    let Courses = JSON.parse(data);
    const newCourse = new Course(title, description, price, imgLink, published,req.user);
    Courses.push(newCourse.getDetails());

    //Writing to COURSES.json file to add new course
    fs.writeFile(COURSES,JSON.stringify(Courses),"utf-8",(err)=>{
      if(err) throw err;
      res.status(200).json({msg : "Published a new course"})
    })

  })
});

app.put("/admin/courses/:courseId", auth , (req, res) => {

  //Fetching data from COURSES.json file
  fs.readFile(COURSES,"utf-8",(err,data)=>{
    let Courses = JSON.parse(data);
    const adminCourses = Courses.filter(course => course.user.userID === req.user);
    const courseIndex = Courses.findIndex(course => course.id === String(req.params.courseId));
    Courses[courseIndex] = {
      ...req.body,
      user: Courses[courseIndex].user
    }
    
    //Writing to COURSES.json file to add new course
    fs.writeFile(COURSES,JSON.stringify(Courses),"utf-8",(err)=>{
      if(err) throw err;
      res.status(200).json({msg: "Updated the course"});
    })
  })
});

app.get("/admin/courses", auth,(req, res) => {

  //Fetching data from COURSES.json file
  fs.readFile(COURSES,"utf-8",(err,data)=>{

    const Courses = JSON.parse(data);
    const adminCourses = Courses.filter(course => course.user.userID === req.user);
    res.status(200).json(adminCourses);
  })
});


// -------------------------------------------------------------------------------------
// User routes

app.post("/users/signup", (req, res) => {

  const { username, password } = req.body;

  //Fetching data from USERS.json file
  fs.readFile(USERS,"utf-8",(err,data)=>{
    if(err) throw err;
    const Users = JSON.parse(data);
    //Check if username/email already taken
    const checkTaken = Users.find((user) => user.username === username);
    if (checkTaken) {
      return res.json({ msg: "Username / Email already taken" });
    }
    const newUser = new User(username, password);
    Users.push(newUser.getDetails());

    //Writing to USERS.json file to add new user
    fs.writeFile(USERS,JSON.stringify(Users),"utf-8",(err)=>{
      if(err) throw err;
      const payload = { user: newUser.getDetails().id };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    })
  })
});
    
app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;
  //Fetching data from USERS.json file
  fs.readFile(USERS,"utf-8",(err,data)=>{
    if(err) throw err;
    const Users = JSON.parse(data);
    
    //Check if user is registered
    const user = Users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    if (user.password === password) {
      const payload = { user: user.id };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    }
  })
});

app.get("/users/courses", auth,(req, res) => {
  
  //Fetching data from COURSES.json file
  fs.readFile(COURSES,"utf-8",(err,data)=>{
    if(err) throw err;
    const Courses = JSON.parse(data);
    res.status(200).json(Courses);
  })
});

app.post("/users/courses/:courseId",auth ,(req, res) => {
  //Fetching data from COURSES.json file
  fs.readFile(COURSES,"utf-8",(err,data)=>{
    if(err) throw err;
    const Courses = JSON.parse(data);
    
    const course = Courses.find(course => course.id === String(req.params.courseId));
    //Fetching data from USERS.json file
    fs.readFile(USERS,"utf-8",(err,data)=>{
      if(err) throw err;
      const Users = JSON.parse(data);
      const userInd = Users.findIndex(user => user.id === req.user);
      
      //Adding Course to user's purchased courses list
      Users[userInd].courses.push(course);
      fs.writeFile(USERS,Users,"utf-8",(err)=>{
        if(err) throw err;
        res.send({msg : "Bought the course"});
      })
    })
  })
});

app.get("/users/purchasedCourses", auth,(req, res) => {
  //Fetching data from USERS.json file
  fs.readFile(USERS,"utf-8",(err,data)=>{
    if(err) throw err;
    const Users = JSON.parse(data);
    const user = Users.find(user => user.id === req.user);
    const courses = user.courses;
    res.status(200).json(courses);
  })
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
