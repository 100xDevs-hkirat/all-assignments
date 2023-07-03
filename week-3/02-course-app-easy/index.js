const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];



const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    req.user = user;  // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuthentication,(req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  const course = req.body;

  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    //course.title=req.body.title
    Object.assign(course, req.body);  //doubt
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses',adminAuthentication,(req,res)=>{
  res.json({courses:COURSES})
})

// User routes
app.post('/users/signup', (req, res) => {
  const user={
    username:req.body.username,
    password:req.body.password,
    purchasedCourse:[]
  }
  USERS.push(user);
  res.json({message:'user created successfully  '})
});

app.post('/users/login',userAuthentication, (req, res) => {
  res.json({message:'Logged in successfully '})
});

app.get('/users/courses', userAuthentication,(req, res) => {
  //let filteredcourse=[]
  //for(i=0;i<COURSES.length;i++){
  // if(COUSES[i].published){
  //  filteredcourse.push(COURSES[i])
  // }
  //}
  res.json({course:COURSES.filter(c=>c.published)})
});

app.post('/users/courses/:courseId',userAuthentication,(req,res)=>{
  const courseId=parseInt(req.params.courseId)
  const course=COURSES.find(c=>c.id===courseId && c.published)
  if(course){
    req.user.purchasedCourse.push(courseId)
    res.json({message:'COURSE purchased successffully'})
  }else{
    res.status(404).json({message:'Course not found or not available'})
  }
})


app.get("/users/purchasedCourses",userAuthentication,(req,res)=>{
  var purchasedCourses=COURSES.filter(c=>req.user.purchasedCourse.includes(c.id))
  // var purchasedCourseIds=req.user.purchasedCourses
  // var purchasedCourses=[]
  // for(let i=0; i<COURSES.length;i++){
  //   if(purchasedCourseIds.indexOf(COURSES[i].id)!==-1){
  //        purchasedCourses.push(COURSES[i])
  //   }
  // }
  res.json({purchasedCourses})
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
  
