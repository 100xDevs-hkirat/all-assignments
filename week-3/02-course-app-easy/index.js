const express = require('express');
const app = express();

app.use(express.json());


let ADMINS = [];
let USERS = [];
let COURSES = [];


const adminAuthentication=(req,res,next)=>{
  const {username,password}=req.headers;

  const adminExist=ADMINS.find(a=>a.username===username && a.password===password);
  if(adminExist){
    next();// jiss route se above function call hua h ussi ko call karega
  }else{
    res.status(403).json({ message: 'Admin authentication failed' });
  }
}

const userAuthentication=(req,res,next)=>{
  const{ username,password }=req.headers;
  const ValidUser=USERS.find(a=>a.username==username && a.password===password);
  if(ValidUser){
    req.user = user;
    next();
  }else{
    res.status(403).json({ message: 'User authentication failed' });
  }

}



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
     let AdminDetails=req.body;
     let AdminExist=false;
     for(let i=0;i<ADMINS.length;i++){
      if(ADMINS[i].username===AdminDetails.username){
        AdminExist=true;
        break;
      }
     }

    if(!AdminExist){
      ADMINS.push(AdminDetails);
      res.json({ message: 'Admin created successfully' });
      
    }else{
      res.status(403).json({ message: 'Admin already exists' });
    }



});

app.post('/admin/login',adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' });
 

  
});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  // logic to create a course
  const course=req.body;
  course.id=Date.now();//use timestamp
  COURSES.push(course);
  res.json({message: 'Course created successfully',courseId:course.id});


});

app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {

  // logic to edit a course
  
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }


});

app.get('/admin/courses', adminAuthentication,(req, res) => {
  // logic to get all courses
  res.json({course:COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user={...req.body, purchasedCourse:[]};
  USERS.push(user);
  res.json({ message: 'User created successfully' });

});

app.post('/users/login',userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: 'Logged in successfully' });

});

app.get('/users/courses', userAuthentication,(req, res) => {
  // logic to list all courses
  let filteredCourses=COURSES.filter(c=>c.published);
  res.json({courses:filteredCourses});

});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => {
  // logic to purchase a course
  let ID=parseInt(courseId);
  let cousre=COURSES.find(c=>c.id===ID && c.published);

 if(cousre){
  req.user.purchasedCourse.push(ID);
  res.json({ message: 'Course purchased successfully' });
 }else{
  res.status(404).json({ message: 'Course not found or not available' });
 }
      


});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses=COURSES.filter(c=>req.user.purchasedCourse.includes(c.id));
  res.json({purchasedCourses});
 

});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
