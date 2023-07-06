const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path')
const mongoose = require('mongoose')
const app = express();
app.use(express.json());

//##################################################################################################################################################
let adminSceret="qwerty";
let userSceret="asdfgh";

//##################################################################################################################################################
//DB STUFF
const adminSchema = new mongoose.Schema({
  username : {
    type: String,
    unique: true,
    required : true
  },
  password : {
    type: String,
    required : true
  }
})

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required : true
  },
  password : {
    type: String,
    unique: true,
    required : true
  },
  purchasedCourses : [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Course'
    }
  ]
})

const courseSchema = new mongoose.Schema({
  title:{
    type: String,
    required : true
  },
  description: {
    type: String,
    required : true
  },
  price: {
    type: Number,
    required : true,
    min : 300
  },
  imageLink: {
    type: String,
    required : true
  },
  published: {
    type: Boolean,
    required : true
  }
})

const Admin = mongoose.model('Admin',adminSchema);
const User = mongoose.model('User',userSchema);
const Course = mongoose.model('Course',courseSchema);

mongoose.connect('mongodb://localhost:27017/courseApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.error("Error in connecting to db\n",err))


//##################################################################################################################################################
//CUSTOM MIDDLEWARE FOR AUTHENTICATION OF ADMINS/USERES AND COURSES

async function validateCredentials(req,res,next){  
  let person =req.path.split('/')[1];   //person is user or admin
  if(req.path.startsWith(`/${person}/signup`)||req.path.startsWith(`/${person}/login`))
    next();
  else
  {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if(person==='admin')
      {
        const credentials = jwt.verify(token, adminSceret);
        req.Admin = await Admin.findOne({username:credentials.username});
        next(); 
      }
      else
      {
        const credentials = jwt.verify(token, userSceret);
        req.User = await User.findOne({username:credentials.username});
        let value = await User.findOne({username:credentials.username});
        console.log("In middleware")
        console.log(credentials);
        console.log(value);
        next();  
      }
    }catch (err){
      res.status(401).send("Unauthorized");
    }
  }
}

//##################################################################################################################################################
//ADMIN ROUTES

app.post('/admin/signup',async (req, res) => {
    const {username,password}=req.body;
    const admin = await Admin.findOne({username});
    if(admin)
      res.status(400).send("User already exists");
    else
    {
      const newAdmin = new Admin({username,password});
      newAdmin.save()                            //it is a thenable object too
        .then(()=>res.send("Admin created successfully"))
        .catch(()=>res.status(400).send("Invalid data"))
    }
});

app.post('/admin/login', async (req,res)=>{
  const {username,password} = req.headers;    //destructor is used here
  let admin = await Admin.findOne({username,password});
  if(admin)
  {
    const payload = {username};               //making json object from header data
    const options = {expiresIn: '1h'};
    const token = jwt.sign(payload,adminSceret,options);
    res.send({message:"Logged in sucessfully",token: `${token}`});
  }
  else
    res.status(404).send("User not found");
});

app.post('/admin/courses', validateCredentials, async (req, res) => {
  const newCourse = new Course(req.body);
  newCourse.save()
    .then(()=>res.send({message : "Course created successfully" , courseId: `${newCourse.id}`}))
    .catch(()=>res.status(400).send("Invalid data"))
});

app.put('/admin/courses/:courseId', validateCredentials, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new : true, runValidators: true});
  if (course)
    res.send({ message: 'Course updated successfully' }); 
  else
    res.status(404).send({ message: 'Course not found' });
});

app.get('/admin/courses', validateCredentials, async (req, res) => {
  const course = await Course.find();
  res.send(course);
});

//##################################################################################################################################################
//USER ROUTES

app.post('/users/signup', validateCredentials, async (req, res) => {
  const {username,password}=req.body;
  const user = await User.findOne({username});
  if(user)
  {
    res.status(400).send("User already exists");
  }
  else
  {
    const newUser = new User({username,password});
    newUser.save()
      .then(()=>res.send("User created successfully"))
      .catch(()=>res.status(400).send("Invalid data"))
  }
});

app.post('/users/login', validateCredentials, async (req,res)=>{
  const {username,password} = req.headers;    //destructor is used here
  let user = await User.findOne({username,password});
  if(user)
  {
    const payload = {username};               //making json object from header data
    const options = {expiresIn: '1h'};
    const token = jwt.sign(payload,userSceret,options);
    res.send({message:"Logged in sucessfully",token: `${token}`});
  }
  else
    res.status(404).send("User not found");
});

app.get('/users/courses', validateCredentials, async (req,res)=>{
  const course = await Course.find({published:true});
  res.send(course);
});

app.post('/users/courses/:courseId', validateCredentials, async (req, res) => {
  const {User} = req;
  const {courseId} = req.params;
  console.log(courseId);
  console.log(User);
  if(courseId)
  {
    User.purchasedCourses.push(courseId);
    await User.save();
    res.send("Course purchased successfully");
  }
  else
    res.status(400).send("Invalid courseId")
});

app.get('/users/purchasedCourses', validateCredentials, async (req,res)=>{
  await req.User.populate('purchasedCourses');
  res.send(req.User.purchasedCourses||[]);
});

//##################################################################################################################################################
//SERVER IS ON
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});