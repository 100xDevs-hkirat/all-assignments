const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require("fs");
const mongoose = require('mongoose');

// MongoDB Setup

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const coursesSchema = new mongoose.Schema({
  id:Number,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

const purchasedCoursesSchema = new mongoose.Schema({
  username:String,
  courseId:Number
});

mongoose.connect('mongodb+srv://swapnilshah5889:%23799201Nag@cluster0.ngruj58.mongodb.net/course-app');
const usersCollection = mongoose.model('users', userSchema);
const adminsCollection = mongoose.model('admins', adminSchema);
const coursesCollection = mongoose.model('courses', coursesSchema);
const pCoursesCollection = mongoose.model('purchased_courses', purchasedCoursesSchema);

app.use(express.json());

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

const jwtSecretAdmin = "$secret%";
const jwtSecretUser = "$secret%user^";


const adminRole = "admin";
const userRole = "user";

function getCourseID() {
  return Math.floor(Date.now()/100);
}

// Check if Admin exists
const adminExists = async (username) => {
  const adminExists = await adminsCollection.findOne({username:username});
  return adminExists;
};

// Check if credentials are correct
const checkLogin = async (username, password) => {
  const validCreds = await adminsCollection.findOne({username:username, password:password});
  return validCreds;
};

const getJWT = (username, jwtSecret, role) => {
  const payload = {
    username,
    role
  };
  return jwt.sign( 
    payload,
    jwtSecret,
    {expiresIn:'1h'}
  );
};

const getAdminJWT = (username) => {
  return getJWT(username, jwtSecretAdmin, adminRole);
}

const getUserJWT = (username) => {
  return getJWT(username, jwtSecretUser, userRole);
}

const authenticateAdminJwt = (req, res, next) => {
  if(req.headers.authorization) {
    const authHeader = req.headers.authorization.split(" ")[1]; 
    if(authHeader) {
      if(jwt.verify(authHeader, jwtSecretAdmin, (err, user) => {

        if(err) {
          return res.status(403).send("Unauthorized");
        }
        if(user.role == adminRole) {
          req.user = user;
          next();
        }
        else {
          return res.status(403).send("Unauthorized");
        }

      }));
    }
    else {
      res.status(403).send("Unauthorized");
    }
  }
  else {
    res.status(403).send("Unauthorized");
  }
};

const authenticateUserJwt = (req, res, next) => {
  if(req.headers.authorization) {
    const authHeader = req.headers.authorization.split(" ")[1]; 
    if(authHeader) {
      if(jwt.verify(authHeader, jwtSecretUser, (err, user) => {

        if(err) {
          return res.status(403).send("Unauthorized");
        }
        if(user.role == userRole) {
          req.user = user;
          next();
        }
        else {
          return res.status(403).send("Unauthorized");
        }

      }));
    }
    else {
      res.status(403).send("Unauthorized");
    }
  }
  else {
    res.status(403).send("Unauthorized");
  }
};

async function authenticateAdmin(req, res, next) {
  if("username" in req.headers && "password" in req.headers){
    const validCreds = await checkLogin(req.headers.username, req.headers.password);
    // If creds correct
    if(validCreds) {
      req.jwtToken = getAdminJWT(req.headers.username);
      next();
    }
    //Incorrect creds 
    else {
      res.status(400).send("Incorrect credentials");
    }

  }
  else {
    res.status(400).send("Missing Parameters");
  }
}

// Check if course exists and is published
const checkValidUserCourse = async (req,res,next) => {
  const course = await coursesCollection.findOne({id:req.params.courseId, published:true});
  // Course available to purchase
  if(course) {
    next();
  }
  // Course not available to purchase
  else{
    res.status(403).send("Invalid course");
  }
}

const checkIfCourseAlreadyPurchased = async (req, res, next) => {
  const pcourse = await pCoursesCollection.findOne({username:req.user.username, courseId:req.params.courseId});
  // If course not purchased
  if(!pcourse) {
    next();
  }
  // Course already purchased
  else {
    res.status(500).send("Course Already Purchased");
  }
};

// Find and update course middleware
const findCourse = async (req, res, next) => {
  const course = await coursesCollection.findOne({id:req.params.courseId});
  if(course) {
    req.course = course;
    next();
  }
  else {
    res.status(403).send("Invalid course ID");
  }
}

const updateCourse = (req, res, next) => {
  req.course.title = req.body.title? req.body.title : req.course.title;
  req.course.description = req.body.description? req.body.description : req.course.description;
  req.course.price = req.body.price? req.body.price : req.course.price;
  req.course.imageLink = req.body.imageLink? req.body.imageLink : req.course.imageLink;
  req.course.published = "published" in req.body? req.body.published : req.course.published;
  next();
};


// Admin routes

// Admin Sign Up Route
app.post('/admin/signup', async (req, res) => {

  if("username" in req.body && "password" in req.body){
    const adminexists = await adminExists(req.body.username, req.body.password);
    if(!adminexists){
      const admin = {
        username:req.body.username,
        password:req.body.password
      };
      const newAdmin = new adminsCollection(admin);
      await newAdmin.save();
      res.status(200).json({message:"Admin created successfully"});
    }
    else {
      res.status(400).send("Admin already exists");
    }
  }
  else {
    res.status(400).send("Missing Parameters");
  }

});

// Admin Login Route
app.post('/admin/login', authenticateAdmin, (req, res) => {
  const jwtToken = getAdminJWT(req.body.username);
  res.status(200).json({message:"Logged in successfully",token:jwtToken});
});

// Add Course
app.post('/admin/courses', authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = req.body;

  // Title not provided
  if(!course.title || !course.description || !course.price || !course.imageLink || !("published" in course)) {
    res.status(403).send("Missing course params");
  }
  course.id = getCourseID();
  const newCourse = await coursesCollection(course);
  newCourse.save();
  res.status(200).send({message:"Course Added Successfully", course:course.id});

});


// Udpate Course Route
app.put('/admin/courses/:courseId', authenticateAdminJwt, findCourse, updateCourse, async (req, res) => {
  // logic to edit a course
  const course = await coursesCollection.findOneAndUpdate({id:req.params.courseId}, req.course, {new:true});
  if(course){
    res.status(200).send({message:"Course Updated Successfully", course});
  }
  else {
    res.status(404).send("Course not found");
  }
});

// Delete course
app.delete('/admin/courses/:courseId', authenticateAdminJwt, findCourse, async (req, res) => {
  const course = await coursesCollection.findByIdAndDelete(req.course._id);
  if(course) {
      res.status(200).send({message:"Course Deleted Successfully", course});
  }
  else{ 
      res.status(500).send("Something went wrong");
  }
});

// All Courses Route
app.get('/admin/courses', authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const allCourses = await coursesCollection.find({});
  if(allCourses)
    res.status(200).json({data:allCourses});
  else 
    res.status(404).json({message:'Something went wrong'});
});

// Functions

// Check if User exists
const userExists = async (username) => {
  const user = await usersCollection.findOne({username});
  return user;
}

// Check if user can login
const checkUserLogin = async (username, password) => {
  const user = await usersCollection.findOne({username, password});
  return user;
}; 

// Authenticate user
const authenticateUser = async (req, res, next) => {
  // If creds in headers
  if(req.headers.username && req.headers.password) {
    
    const userLoggedIn = await checkUserLogin(req.headers.username, req.headers.password);
    // If correct credentials
    if(userLoggedIn) {
      next();
    }
    else {
      res.status(403).send("Invalid credentials");
    }
  }
  else{
    res.status(403).send("Missing authentication");
  }
};

// User routes

// User Sign Up Route
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  
  // If params available
  if(req.body.username && req.body.password) {
    const userexists = await userExists(req.body.username)
    //If user already exists
    if(userexists) {
      res.status(403).send("User Already Exists");
    }
    // User does not exists, create a new user
    else {
      const newUser = await usersCollection(req.body)
      newUser.save();
      if(newUser) {
        res.status(200).send("User created successfully");
      }
      else {
        res.status(500).send("Something went wrong");
      }
    }
  }
  // Missing params
  else {
    res.status(403).send("Missing parameters");
  }

});

// Login User
app.post('/users/login', authenticateUser, (req, res) => {
  // logic to log in user
  const token = getUserJWT(req.headers.username);
  res.status(200).send({message:"Login successful", token:token});
});

// Fetch All UserCourses
app.get('/users/courses', authenticateUserJwt, async (req, res) => {
  // logic to list all courses

  const userCourses = await coursesCollection.find({published:true});
  if(userCourses) {
    res.status(200).json(userCourses);
  }
  else {
    res.status(500).send("Something went wrong");
  }
});


// Purchase Course Route
app.post('/users/courses/:courseId', authenticateUserJwt, checkValidUserCourse,
  checkIfCourseAlreadyPurchased, async (req, res) => {
  // logic to purchase a course
  
  const obj = {
    username:req.user.username,
    courseId:parseInt(req.params.courseId)
  }

  const newPCourse = await pCoursesCollection(obj);
  if(newPCourse) {
    newPCourse.save();
    res.status(200).json({message:"Course Purchased Successfully", data:newPCourse});
  }
  else {
    res.status(500).json({message:"Something went wrong"});
  }

});

// Fetch All Purchased Courses
app.get('/users/purchasedCourses', authenticateUserJwt, async (req, res) => {
  const purchasedIds = await pCoursesCollection.find({username:req.user.username}, {courseId:1,_id:0});

  const purchasedIdArr = purchasedIds.map((idJson) => {
    return idJson.courseId;
  });

  const purchasedCourses = await coursesCollection.find({id:{$in:purchasedIdArr}});
  res.status(200).json({purchasedCourses:purchasedCourses});
  
});


//Invalidate other paths

function pageNotFound(req, res) {
  res.status(404).json({ status:false, message: 'Invalid request'});
}
app.get('*', (req, res) => {
  pageNotFound(req, res);
});
app.post('*', (req,res) => {
  pageNotFound(req, res);
});
app.put('*', (req,res) => {
  pageNotFound(req, res);
});
app.delete('*', (req,res) => {
  pageNotFound(req, res);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
