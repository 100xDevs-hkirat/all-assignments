import express from 'express';  
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const authentication= (req,res,next) =>{
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username == username && a.password == password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
}

const userAuthentication = (req,res,next)=>{
  const { username, password } = req.headers;

  const user = USERS.find(a => a.username == username && a.password == password);
  if (user) {
    req.user = user; // added this line to fix the error
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  const admins = req.body;
  const existingUser = ADMINS.find((a)=>a.username == admins.username);
  if(existingUser){
    res.status(403).json({message:"User already exists"})

  }else{
    ADMINS.push(admins)
    res.status(201).send("Admin created succesfully")
  }

});

app.post('/admin/login', authentication,(req, res) => {
  res.json({ message: 'Logged in successfully' });
});
var id = 1;
app.post('/admin/courses',authentication, (req, res) => {
    const courses = req.body
    courses.id = id++;
    COURSES.push(courses)
    res.json({message: 'Course created successfully', courseId: courses.id})

});

app.put('/admin/courses/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const editCourses = COURSES.findIndex((a)=>a.id===courseId);
  COURSES[editCourses] = req.body;
  COURSES[editCourses].id = courseId;
  res.json(COURSES[editCourses]);
});

app.get('/admin/courses',authentication, (req, res) => {
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  const userDetails = {...req.body, purchasedCourses: []};
  USERS.push(userDetails)
  res.json({message: "Account Created Successfuully"});
});



app.post('/users/login',userAuthentication, (req, res) => {
  res.send({message: 'Logged in Succesfully'})
});

app.get('/users/courses',userAuthentication, (req, res) => {
  var filteredCourses = COURSES.filter(c => c.published);//only true value will be populated insdide users/courses
  res.json(filteredCourses);
});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => { //
  // logic to purchase a course
  let id = parseInt(req.params.courseId)
  let availableCourse = COURSES.find(a=>a.id == id && a.published)
  
  if(availableCourse){
    req.user.purchasedCourses.push(availableCourse)
    res.json({message: "Course Purchased successfully "})
  } else{
    res.json({message: "Course not found or not avaialable"})
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }  res.json({purchasedCourses})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
