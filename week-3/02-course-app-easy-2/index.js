const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//controller for the unique id
admin_ctr = 0;
user_ctr = 0;
course_ctr = 0;

//authentictaion for admin using jwt
const adminAuthenticate = (req,res,next) => {

  const token = req.headers.cookie;
  const t = token.split("=");
  token1 = t[1];
  console.log(token1);
  try {
  const data = jwt.verify(token1,"Sec_key");
  console.log("token varified")
  req.user = data;
  next();
  } catch (error) {
    res.clearCookie("token");
    res.status(403).send({"message":"forbiden:user not authenticate 00"})
    
  }
  

}

// authentication for User using jwt

const userAuthenticate = (req,res,next) =>{

  const token = req.headers.cookie;
  const token1 = token.split("=")[1];
  console.log(token1);

try {
  const userdata = jwt.verify(token1,"sec_user_key");
  req.user = userdata;
  console.log(userdata);
  next();
} catch (error) {
  console.log(error);
  res.clearCookie("userToken");
  res.send({"message":"user is not authenticate 00"})
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
    const foundAdmin = ADMINS.find(u=>u.username===data.username)

    if(!foundAdmin){
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
    else{
      res.status(402).json({"message": 'Admin already exist' });
    }
    
  }
});

app.post('/admin/login',(req, res) => {
  // logic to log in admin
  const {username,password} = req.headers;
  const foundAdmin = ADMINS.find(u=>u.username===username && u.password === password)

  if(foundAdmin){
    const adminToken = jwt.sign(foundAdmin , "Sec_key" , {expiresIn:"1min"});
    res.cookie("token",adminToken ,{
      httpOnly:true,  
    })
    console.log(adminToken);
    res.status(200).send({"message":"Admin Login sucessfully"})

  }else{
    res.status(403).send({"message":"Admin authentication failed login"});
  }


});

app.post('/admin/courses', adminAuthenticate ,(req, res) => {
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

app.put('/admin/courses/:courseId', adminAuthenticate ,(req, res) => {
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

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  console.log("admin :"+req.user.username);
  res.status(200).json({"message":COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username , password} = req.body;

  const foundUser = USERS.find(u=>u.username===username)

    if(!foundUser){
    const newUser = {
    "userId":c=user_ctr,
    "username":username,
    "password":password,
    "purchesedCourse":[]
  }
  USERS.push(newUser);
  user_ctr++;
  console.log(USERS);
  res.send({"message":"new user created successfully"})
  res.status(200).send();
}else{
  res.status(402).json({"message": 'User already exist' });
}

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username , password} = req.headers;
  const foundUser = USERS.find(u=>u.username===username && u.password===password);

  if(foundUser){
    const userToken = jwt.sign(foundUser,"sec_user_key",{expiresIn:'10mins'});
    res.cookie("userToken",userToken,{
      "httpOnly":true
    })
    res.send({"message":"User Log in sucessfully"})
  }else{
    res.status(401).send({"message":"user details are incorrect"});
  }
});

app.get('/users/courses', userAuthenticate,(req, res) => {
  // logic to list all courses
  res.status(200).send({"message":COURSES});
});

app.post('/users/courses/:courseId',userAuthenticate ,(req, res) => {
  // logic to purchase a course
  const user = req.user;
  const foundCourse = COURSES.find(c=>c.courseId===req.params.courseId);

  if(foundCourse){
    user.purchesedCourse.push(foundCourse);
    res.status(201).send({"message":"course successfully purchesed","course":req.params.courseId})
  }else{
    res.status(404).send({"message":"course not found","course":req.params.courseId})
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const user = req.user;
  console.log(user);
  res.status(201).send(user.purchesedCourse);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
