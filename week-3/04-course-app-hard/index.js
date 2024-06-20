require('dotenv').config()
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const app = express();



app.use(express.json());
app.use(bodyParser.json());

const generateJwtAdmin = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_ADMIN, {expiresIn : '1h'});
  return accessToken

}
const authenticateJwtAdmin = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN, (err, user) => {
    if(err) throw err;
    if(user){
      req.user = user
      next();
    }
    else{
      res.send("Unable to log in");
    }
  })

}


const generateJwtUser = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_USER, {expiresIn : '1h'});
  return accessToken

}

const authenticateJwtUser = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER, (err, user) => {
    if(err){
      console.log("There is an error")
      
    };
    if(user){
      req.user = user
      next();
      
    }
    else{
      res.send("Unable to log in");
    }
  })

}




mongoose.connect('mongodb+srv://sidakmalhotra:BhxpAsmNmp9grpnd@cluster0.ufz27yk.mongodb.net/Courses')

const userSchema = new mongoose.Schema({
  username : String,
  password : String,
  purchasedCourses : [{type : mongoose.Schema.Types.ObjectId, ref :'Course'}]

})

const courseSchema = new mongoose.Schema({
  id: Number,
   title: String, 
   description: String, 
   price: Number, 
   imageLink: String, 
   published: Boolean 
})
const adminSchema = new mongoose.Schema({
  username :String,
  password : String
})


const Admins = mongoose.model("Admins", adminSchema);
const Users = mongoose.model("Users", userSchema);
const Course = mongoose.model("Course", courseSchema);

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
 const obj = req.body;
 const {username, password} = req.body;

try {
const existingAdmin = await Admins.findOne({username});
if(existingAdmin){
  res.send({message: "Admin already exists"})
}
else{
  const accessToken = generateJwtAdmin(obj);
  const newAdmin = new Admins(obj);
  await newAdmin.save();
  res.send({
    message : "User Signed up Successfully",
    accessToken,
  });

}
}
catch(err){
  console.log(err.message);
}

});


app.post('/admin/login', async (req, res) => {
  // logic to log in admin
const {username, password} = req.headers;
try{
const user = await Admins.findOne({username,password});
if(user){
  const accessToken = generateJwtAdmin({username, password});
  res.send({message:"Admin Logged in successfully", accessToken});
}
else{
  res.status(404).send("invalid credentials");
}  
}
catch(err){
  console.log(err.message);
}
  

});

app.post('/admin/courses', authenticateJwtAdmin, async (req, res) => {
  // logic to create a course
try{

  console.log("HEEEEEELLLLOOOOO")
  var body = req.body;
  var {title, descriptipn, price, imageLink, published} = body;
  var id = Math.floor(Math.random() * 10000)


  var obj = {
    id,
    title,
    descriptipn, 
    price, 
    imageLink, 
    published
  }

  const newCourse =  new Course(obj);
  await newCourse.save();
  res.send({
    message: "Course created Successfully",
    id
  })


}
catch(err) {
  console.log(err.message);
}

});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, async (req, res) => {
  // logic to edit a course
try{

  const id = parseInt(req.params.courseId);
  var body = req.body;
  const newCourse = await Course.findOneAndUpdate({id}, body, {new : true});
  if(newCourse) res.send("Course Updated Sucessfully");
  else res.status(404).send("Course does not exist");

}
catch(err) {
  console.log(err.message);
}

});

app.get('/admin/courses',authenticateJwtAdmin, async (req, res) => {
  const newCourse = await Course.find();
  res.send(newCourse);

});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user

  const {username, password} =  req.body;
  try{
  const user = await Users.findOne({username,password});

  if(user){
    res.send("User already exists");
  } 

  else{
    const newUser = new Users({username,password});
    await newUser.save();
    accessToken = generateJwtUser({username, password});
    res.send({message : "User created successfully", accessToken})
}

  }
  catch(err){
    console.log(err.message);
  }


});

app.post('/users/login', async (req, res) => {
  const {username, password} = req.headers;
  const user = await Users.findOne({username,password});
  if(user){
    const accessToken = generateJwtUser({username,password});
    res.send({message:"User Logged in successfully", accessToken});
  }
  else{
    res.status(404).send("invalid credentials");
  } 


});

app.get('/users/courses', authenticateJwtUser, async (req, res) => {
  const courses = await Course.find({});
  res.send(courses);


});

app.post('/users/courses/:courseId',authenticateJwtUser, async (req, res) => {
  // logic to purchase a course
  try {
  var id = parseInt(req.params.courseId);
  var username = req.user.username;
  const course = await Course.findOne({id});
  const newUser = await Users.findOne({username});
  if(course){
    newUser['purchasedCourses'].push(course);
    await newUser.save()
    res.send({
      message: "Course Purchased Successfully"
    })
  }
  else{
    res.status(404).send("Course does not exist");
  }
}
catch(err){
  console.log(err.message);
}
});

app.get('/users/purchasedCourses', authenticateJwtUser, async (req, res) => {
  // logic to view purchased courses
  try{
  var username = req.user.username;
  const newUser = await Users.findOne({username});
  res.send(newUser['purchasedCourses'])
  }
  catch(err){
    console.log(err.message)
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});