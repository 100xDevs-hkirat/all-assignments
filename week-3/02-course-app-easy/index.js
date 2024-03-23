const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next)=>{
  const {username,password}=req.headers;
  const admin= ADMINS.find((a)=>{
    return a.username===username && a.password===password
  })

  if(admin) next();

  else res.status(403).json({message:"Admin Authentication Failed"});
}

const userAuthentication=(req,res,next)=>{
  const {username,password}=req.headers;
  const user= USERS.find((u)=>{
    return u.username===username && u.password===password
  })
  if(user) 
  {
    req.user=user;
    next();
  }
  else res.status(403).json({message:"User Authentication Failed"});
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin=req.body;
  const existing= ADMINS.find((a)=>{
    return a.username===admin.username && a.password===admin.password
  });

  if(existing)res.status(403).json({message: "Admin already Exist"});
  
  else
  {
    ADMINS.push(admin);
    res.json({message: "Admin Created Successfully"});
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({message: "Admin Login Successful"});
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const course=req.body;
  course.id=Date.now();

  COURSES.push(course);
  res.json({message:"Course created successfully", courseId:course.id});
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId= parseInt(req.params.courseId);
  const editing=req.body;
  const course= COURSES.find(a => a.id === courseId);
  
  if(course){
    Object.assign(course,editing);
    res.json({message:"Course Updated Successfully"})
  } 
  else
  {
    res.status(404).json({message:"Course not found"});
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user=req.body;
  const existing= USERS.find((u)=>{
    return u.username===user.username && u.password===user.password
  });

  if(existing)res.status(403).json({message: "User already Exist"});
  
  else
  {
    USERS.push(user);
    res.json({message: "User Created Successfully"});
  }
});

app.post('/users/login',userAuthentication, (req, res) => {
  // logic to log in user

  res.json({message: "User login successful"})

});

app.get('/users/courses',userAuthentication, (req, res) => {
  // logic to list all courses
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId= req.params.courseId;
  const course= COURSES.find(c=>c.id===courseId && c.published);

  if(course)
  {
    req.user.purchased.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  }
  else{
    res.status(404).json({ message: 'Course not found or not available' });
  }


});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  let purchasedID=req.user.purchased;
  let purchasedCourses=[];

  for(let i=0; i<purchasedID.length; i++)
  {
     let course=COURSES.find(c => c.id === purchasedID[i]);

     if(course) purchasedCourses.push(course);
  }

  res.json({courses:purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
