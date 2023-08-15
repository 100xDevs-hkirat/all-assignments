const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//controller for the unique id
admin_ctr = 0;
user_ctr = 0;
course_ctr = 0;

//add autentication

const AdminAutentication = (req,res,next) => {

  const {username , password} = req.headers;
  let foundAdmin = ADMINS.find(a=>a.username===username && a.password===password);

  if (foundAdmin) {
    console.log(foundAdmin);
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
}

const userAuthentication =(req,res,next) => {

  const {username,password} = req.headers;

  const foundUser = USERS.find(u=>u.username===username && u.password === password)

  if(foundUser){
    next();
  }else{
    res.status(403).send({"message":"User authentication failed"});
  }

}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let data = req.body;
  if(!(data.username) || !(data.password)){
    res.send({"message" : "Please enter Detail correctly"})
  }
  else{
    //creating newadmin object for storing new admin data 
    let newAdmin = {
      "admin_id":admin_ctr,
       "username" : data.username,
       "password" : data.password
      }
      ADMINS.push(newAdmin);
      admin_ctr++;
      console.log(ADMINS);
    
      res.json({"message": 'Admin created successfully' });
  }
});

app.post('/admin/login',AdminAutentication,(req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' });

});

app.post('/admin/courses',AdminAutentication ,(req, res) => {
  // logic to create a course
  

  const newCourse = {
    "courseId":course_ctr,
    "title":req.body.title,
    "description":req.body.description,
    "price":req.body.price,
    "imageLink":req.body.imageLink,
    "published":req.body.published,
  }
  COURSES.push(newCourse);

  console.log(COURSES);
  res.send({"message":'Course created successfully',"courseId":newCourse.courseId})
  res.status(200).send();
  course_ctr++;
});

app.put('/admin/courses/:courseId', AdminAutentication ,(req, res) => {
  // logic to edit a course
  const {courseId} = req.params;
  
  const foundCourse = COURSES.find(c=>c.courseId==Number(courseId));

  const {title , description , price , imageLink , published}= req.body;

  if(foundCourse){
  foundCourse.title = title,
  foundCourse.description = description,
  foundCourse.price = price,
  foundCourse.imageLink = imageLink,
  foundCourse.published = published

  res.send({"message":"course is updated","coursId":foundCourse.courseId})
  res.status(201).send();

  }else{
  res.send({"message":"course not found","coursId":courseId})
  res.status(404).send();
  }

});

app.get('/admin/courses', AdminAutentication,(req, res) => {
  // logic to get all courses
  res.send(COURSES);
  res.send(200).send();
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username , password} = req.body;

  const newUser = {
    "userId":c=user_ctr,
    "username":username,
    "password":password,
    "purchesedCourse":[]
  }
  USERS.push(newUser);
  user_ctr++;
  res.send({"message":"new user created successfully"})
  res.status(200).send();
});

app.post('/users/login', userAuthentication,(req, res) => {
  // logic to log in user
  res.send({"message":"user login successfully"})
});

app.get('/users/courses', userAuthentication ,(req, res) => {
  // logic to list all courses
  res.status(200).send({"message":COURSES});
});

app.post('/users/courses/:courseId', userAuthentication,(req, res) => {
  // logic to purchase a course
  const foundCourse = COURSES.find(c=>c.courseId==req.params.courseId);

  const {username,password} = req.headers;
  const foundUser = USERS.find(u=>u.username===username && u.password === password);

  console.log(foundCourse);
  if(foundCourse){
    
    foundUser.purchesedCourse.push(foundCourse);
    res.status(201).send({"message":"course Purchased Successfully","courseId":req.params.courseId})
  
  }else{
    res.send({"message":"course not found","courseId":req.params.courseId});
  }

});

app.get('/users/purchasedCourses', userAuthentication,(req, res) => {
  // logic to view purchased courses
  const {username,password} = req.headers;

  const foundUser = USERS.find(u=>u.username===username && u.password === password);
  const data = foundUser.purchesedCourse;
  res.status(201).send({"purchasedCourses":data});

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
