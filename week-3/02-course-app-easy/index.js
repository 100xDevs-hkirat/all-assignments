const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [{
  "username": "admin_username",
  "password": "admin_password"
}];

let USERS = [{
  "username": "user_username",
  "password": "user_password"
}];

let COURSES = [{
  "title": "Sample Course 1",
  "description": "This is the first sample course.",
  "price": 50,
  "imageLink": "https://sampleimage1.com",
  "published": true,
  "id": 1688674628638
},
{
  "title": "Sample Course 2",
  "description": "This is the second sample course.",
  "price": 75,
  "imageLink": "https://sampleimage2.com",
  "published": true,
  "id": 1688674646303
},
{
  "title": "Sample Course 3",
  "description": "This is the third sample course.",
  "price": 120,
  "imageLink": "https://sampleimage3.com",
  "published": false
},
{
  "title": "Sample Course 4",
  "description": "This is the fourth sample course.",
  "price": 90,
  "imageLink": "https://sampleimage4.com",
  "published": true,
  "id": 1688674664224
},
{
  "title": "Sample Course 5",
  "description": "This is the fifth sample course.",
  "price": 200,
  "imageLink": "https://sampleimage5.com",
  "published": false
}];

const adminAuthentication = (req,res,next)=>{
  let {username,password} = req.headers;
  
  const isExisted = ADMINS.find(admin=> admin.username==username&& admin.password==password);

  if(isExisted){
    next();
  }
  else{
    res.status(403).json({error:'Admin authentication failed'});
  }
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  
  
  if (user) {
    req.user = user;
    if (!req.user.purchaseCourses) {
      req.user.purchaseCourses = []; // Initialize purchaseCourses array if it doesn't exist
    }
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const isExisted = ADMINS.find(adminData=> adminData.username===admin.username && adminData.password===admin.password);
  if(isExisted){
    
    res.status(403).json({message:'Admin already exists'});
  }
  else{
    ADMINS.push(admin);
    res.json({message:'Admin created successfully'});
  }

});

app.post('/admin/login',adminAuthentication, (req, res) => {
  res.json({message:"Logged in successfully."});
});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({message:"The course is created successfully",CourseId:course.id});
  
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const isExisted  = COURSES.find(course=> course.id===courseId);
  if(isExisted){
    Object.assign(isExisted,req.body);
    res.json({ message: 'Course updated successfully' });
  }
  else{
    res.json({message:"The course does not exist."});
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
    res.json({courses: COURSES});
});



// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    purchaseCourses: [], // Corrected property name
  };

  USERS.push(newUser);
  console.log(newUser); // Log the user object here
  res.json({ message: "User is created successfully" });
});



app.post('/users/login',userAuthentication, (req, res) => {
  // logic to log in user
  res.send({ message: 'Logged in successfully' });
});

app.get('/users/courses',userAuthentication, (req, res) => {
  // logic to list all courses
  let filterCourses = COURSES.filter(course=>{
    return course.published===true;
  })

  res.send({courses:filterCourses});
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    req.user.purchaseCourses.push(courseId); 
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});


app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchaseCourse;
  var purchaseCourses = [];
  console.log(purchasedCourseIds);
  for(let i=0;i<COURSES.length;i++)
  {
    if(purchasedCourseIds.indexOf(COURSES[i].id)!=-1){
      purchaseCourses.push(COURSES[i]);
    }
  }
  res.json({purchaseCourses});

});

app.listen(3001, () => {
  console.log('Server is listening on port 3000');
});



