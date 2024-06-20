const express = require('express');
const jwt=require("jsonwebtoken")
const mongoose=require('mongoose')
const app = express();

app.use(express.json());

const SECRET="hulk";

//const token= jwt.sign(userSchema,SECRET,{})

const userSchema=new mongoose.Schema({
  username:String,
  password:String,
  purchasedCourse:[{type: mongoose.Schema.Types.ObjectId,ref:'Course'}]
})

const adminSchema=new mongoose.Schema({
  username:String,
  password:String
})

const courseSchema=new mongoose.Schema({
  title:String,
  descripition:String,
  price:Number,
  inmageLink:String,
  published:Boolean
})

const User=mongoose.model('User',userSchema)
const Admin=mongoose.model('Admin',adminSchema)
const Course=mongoose.model('Course',courseSchema)

const authenticateJWT=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(authHeader){
    const token=authHeader.split(" ")[1];
    jwt.verify(token,SECRET,(err,user)=>{
      if(err){
        return res.sendStatus(403)
      }
      req.user=user
      next()
    });
  }else{
    res.sendStatus(401);
  }
}

mongoose.connect("mongodb+srv://kart00ik:___________@kartikcluster.eo6goqt.mongodb.net/courses",{useNewUrlParser:true,useUnifiedTopology:true})

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];


// Admin routes
app.post('/admin/signup', async(req, res) => {
  // logic to sign up admin
  const {username,password}=req.body;
  const admin= await Admin.findOne({username})
  if(admin){
    res.status(403).json({message:"allready Exists admin"})
  }else{
    const obj={username:username,password:password}
    const newAdmin=new Admin(obj)
    await newAdmin.save()
    const token=jwt.sign({username,role:"admin"},SECRET,{expiresIn:'1h'})
    res.json({message:'Admin created SuCCeSSfully',token})
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username,password}=req.headers
  const admin =await Admin.findOne({username,password})
  if(admin){
    const token=jwt.sign({username,role:'admin'},SECRET,{expiresIn:'1h'})
    res.json({message:"admin logged in suCCeSSfully",token})
  }else{
    res.status(403).json({message:'Invelid Username Password'})
  }
});

app.post('/admin/courses', async(req, res) => {
  // logic to create a course
  const course=new Course(req.body)
await course.save()
res.json({message:"course created Successfully",courseId:course.id})
});

app.put('/admin/courses/:courseId', async(req, res) => {
  // logic to edit a course
  const course=await Course.findByIdAndUpdate(req.params.courseId,req.body,{new:true})
  if(course){
    res.json({message:'course updated successfully'})
  }else{
    res.status(404).json({message:'Course not found'})
  }
});

app.get('/admin/courses', async(req, res) => {
  // logic to get all courses
  const course= await Course.find({})
  res.json({course})
});

// User routes
app.post('/users/signup', async(req, res) => {
  // logic to sign up user
  const {username,password}=req.body
  const user= await User.findOne({username})
  if(user){
    res.status(403).json({message:"User Allready exits"})
  }else{
    const newUser=new User({username,password})
    await newUser.save()
    const token= jwt.sign({username,role:'user'},SECRET,{expiressIn:'1h'})
    res.json({message:'User created SuCCessfully',token})
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username,password}=req.headers;
  const user=await User.findOne({username,password})
  if(user){
    const token=jwt.sign({username,role:"user"},SECRET,{expiresIn:"1h"})
    res.json({message:"you logged in sUCCeSSfully",token})
  }else{
    res.statusCode(403).json({message:'someting went wrong'})
  }
});

app.get('/users/courses', async(req, res) => {
  // logic to list all courses
  const course=await Course.find({published:true})
  res.json({course})
});

app.post('/users/courses/:courseId', authenticateJWT,async(req, res) => {
  // logic to purchase a course
  const course= await Course.findById(req.params.courseId);
  if(course){
    const user= await User.findOne({username:req.user.username})
    if(user){
      user.purchasedCourse.push(course)
      await user.save()
      res.json({message:'Course purchased successfully'})
    }else{
      res.status(403).json({message:'user not found'})
    }
  }else{
    res.status(404).json({message:"Course not found"})
  }
});

app.get('/users/purchasedCourses',authenticateJWT,async (req, res) => {
  const user =await User.findOne({username:req.user.username}).populate("purchasedCourse")
  if(user){
    res.json({purchasedCourse:user.purchasedCourse||[]})
  }else(
    res.status(403).json({message:'User not Found'})
  )
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
