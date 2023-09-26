const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const adminAuthentication = (req ,res , next)=>{
  const {username , password } = req.headers;
  const index = ADMINS.find(ad => ad.username === username  && ad.password == password );
  if(index){
    next();
  }
  else {
    res.status(404).json({message:'admin autnentation failed'});
    
  }

}

const userAuthentication = (req , res , next)=>{
  const { username , password}=req.headers;

  let user = USERS.find(a => a.username === username && a.password == password)
  
  if(user){
    req.user = user
    next()

  }
  else{
    res.status(404).json({message:"user authentation failed"})

  }
}




app.post('/admin/signup', (req, res) => {
  const admin = req.body
  let ispresent = ADMINS.find(a => a.username === admin.username)
  if(ispresent){
    res.status(404).json({message:'admin already present'})
  }
  else{
    ADMINS.push(admin)
    res.status(200).json({message:'admin created sucessfully'})
  }
});



app.post('/admin/login', adminAuthentication ,  (req, res) => {
  res.status(200).json({message : "logged ins sucessfully"})
  
});

app.post('/admin/courses', adminAuthentication , (req, res) => {
  const course = req.body
  course.id=Date.now()
  COURSES.push(course)
  res.status(404).json({message : "course created sucessfully " , courseId : course.id})
  
});

app.put('/admin/courses/:courseId', adminAuthentication , (req, res) => {
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.find(a => a.id === courseId)
  if(course ){
    Object.assign(course , req.body)
    res.status(200).json({message : "course updated sucessfully "})
  }
  else{
    res.status(404).json({message : "course not found"})

  }
});

app.get('/admin/courses', adminAuthentication ,  (req, res) => {

  res.status(404).json({courses : COURSES})
  
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.body
  let ispresent = USERS.find(a => a.username === user.username)
  if(ispresent){
    res.status(404).json({message:'user already present'})
  }
  else{
    USERS.push(user)
    res.status(200).json({message:'user created sucessfully'})
  }
});

app.post('/users/login', userAuthentication , (req, res) => {
  res.status(404).json({message: "logged in sucessfully "})
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (!req.user.purchasedCourses) {
    req.user.purchasedCourses = []; // If not, create an empty array
  } 
  
  
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  // var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  // var purchasedCourses = [];
  // for (let i = 0; i<COURSES.length; i++) {
  //   if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
  //     purchasedCourses.push(COURSES[i]);
  //   }
  // }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
