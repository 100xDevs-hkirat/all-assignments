const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [
  {
    "username": "test2",
    "password": "123"
}
];
let USERS = [];
let COURSES = [];
let gid = 0;

app.use((req,res,next)=> {
  console.log(ADMINS);
  next();
});


const checkAdmin = function (username, password) {
  
  return ADMINS.find((admin) => {
    return admin.username === username && admin.password === password;
  })
;
  
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  if(checkAdmin(username,password)){
    res.status(200).send({Error: "Admin Already Exists"});
  }
  ADMINS.push({
    username,
    password,
  });
  

  res.status(201).json({
    status: "success",
    message: "Admin Created Succesfully",
    ADMINS
  });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(404).send({
      Error: "Please Provide the username and password",
    });
  }


  if (checkAdmin(username, password)) {
    res.status(200).send({ message: "Login Succesfully", ADMINS });
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;

  const isAdmin = checkAdmin(username, password);
  console.log(isAdmin);

  if (!isAdmin) {
    res.status(403).json({ message: "Admin is Not Authorised" });
  }

  gid++;

  COURSES.push({
    id: gid,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published,
  });

  res.status(201).json({message: "Created Succesfully"},
  COURSES);
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const {username, password} = req.headers;

  if(!checkAdmin(username,password)){
    res.status(400).send({Message: "User Not Found"})
  }

  const cid = COURSES.findIndex((course) => course.id === req.params.courseId);

  if(cid){
      COURSES[cid].title = req.body.title;
      COURSES[cid].description = req.body.description;
      COURSES[cid].price = req.body.price;
      COURSES[cid].imageLink = req.body.imageLink;
      COURSES[cid].published = req.body.published;
      res.status(200).json({ message: "Course detailed are upadated succesfully" });

  }
});

app.get("/admin/courses", (req, res) => {
  const {username, password} = req.body;
 // console.log(username,typeof(password),checkAdmin(username, password));
  if(checkAdmin(username, password)){
    res.status(200).send({COURSES});
  }else{
    res.status(403).send({message: "Not Authorised"})
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;
  if(checkUser(username,password)){
    res.status(400).json({message:"User Already Exists"});
  }
  
  USERS.push({
    username,
    password,
    purchasedCourses: []
  });

  res.status(201).json({
    status: "success",
    message: "User Created Succesfully",
    USERS
  });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(404).send({
      Error: "Please Provide the username and password",
    });
  }

  

  if (checkUser(username, password)) {
    res.status(200).send({ message: "Login Succesfully", USERS });
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  const {username, password} = req.body;
  if(checkUser(username, password)){
    res.status(200).send({COURSES});
  }else{
    res.status(403).send({message: "Not Authorised"})
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const {username, password} = req.headers;

  if(!checkUser(username,password)){
    res.status(400).send({Message: "User Not Found"})
  }
   const cid = COURSES.findIndex((course) => course.id === req.params.courseId);

   if(cid){
    purchasedCourses.push(COURSES[cid])
    res.status(200).send({Buyed_courses: purchasedCourses})
   }

});

app.get("/users/purchasedCourses", (req, res) => {
  const {username, password} = req.body;
  // logic to view purchased courses
  if (!checkUser()) {
    res.status(403).json({ message: "Forbidden or Unauthorised" });
  } else {
    res.status(200).json({ purchasedCourses });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
