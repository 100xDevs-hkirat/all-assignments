const express = require('express');
const app = express();

app.use(express.json());

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})


let ADMINS = [];
let USERS = [];
let COURSES = [];
let purchasedCourses = {};


function getCourseID() {
  return Math.floor(Date.now()/100);
}

// Admin routes

// Check if Admin exists
const adminExists = (username) => {
  return ADMINS.some((user) => {
      return user.username == username;
  });
};

// Check if credentials are correct
const checkLogin = (username, password) => {
  return ADMINS.some((user) => {
    return (user.username == username && user.password == password);
  });
};


// Admin Sign Up Route
app.post('/admin/signup', (req, res) => {

  if("username" in req.body && "password" in req.body){
    if(!adminExists(req.body.username, req.body.password)){
      const admin = {
        username:req.body.username,
        password:req.body.password
      };
      ADMINS.push(admin);
      res.status(200).send("Admin added successfully");
    }
    else {
      res.status(400).send("Admin already exists");
    }
  }
  else {
    res.status(400).send("Missing Parameters");
  }
  
});


function authenticateAdmin(req, res, next) {
  if("username" in req.headers && "password" in req.headers){
    
    // If creds correct
    if(checkLogin(req.headers.username, req.headers.password)) {
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

// Admin Login Route
app.post('/admin/login', authenticateAdmin, (req, res) => {
    res.status(200).send("Login Successful");
});

app.post('/admin/courses', authenticateAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;

  // Title not provided
  if(!course.title || !course.description || !course.price || !course.imageLink || !course.published) {
    res.status(403).send("Missing course params");
  }
  course.id = getCourseID();
  COURSES.push(course);
  console.log(COURSES);
  res.status(200).send({message:"Course Added Successfully", data:course});

});

// Check if course exists and is published
const checkValidUserCourse = (req,res,next) => {
  const course = COURSES.find((course) => (course.id == req.params.courseId && course.published));
  // Course available to purchase
  if(course) {
    next();
  }
  // Course not available to purchase
  else{
    res.status(403).send("Invalid course");
  }
}

// Find and update course middleware
const findCourse = (req, res, next) => {
  const course = COURSES.find((course) => course.id == req.params.courseId);
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

// Udpate Course Route
app.put('/admin/courses/:courseId', authenticateAdmin, findCourse, updateCourse, (req, res) => {
  // logic to edit a course
  COURSES.map((course) => {
    if(course.id == req.params.courseId) {
      course = req.course;
    }
    else {
    }
    return course;
  });
  res.status(200).send({message:"Course updated",data:req.course});
});

// All Courses Route
app.get('/admin/courses', authenticateAdmin, (req, res) => {
  // logic to get all courses
  res.status(200).json({data:COURSES});
});

//Functions
const checkUserCoursePurchased = (userid, courseId) => {
  return purchasedCourses[userid].some((course) => course==courseId);
}

// Check if User exists
const userExists = (username) => {
  return USERS.some((user) => user.username == username);
}

// Check if user can login
const checkUserLogin = (username, password) => {
  return USERS.some((user) => (user.username == username && user.password == password));
}; 

// Authenticate user
const authenticateUser = (req, res, next) => {
  // If creds in headers
  if(req.headers.username && req.headers.password) {
    
    // If correct credentials
    if(checkUserLogin(req.headers.username, req.headers.password)) {
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
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  
  // If params available
  if(req.body.username && req.body.password) {

    //If user already exists
    if(userExists(req.body.username)) {
      res.status(403).send("User Already Exists");
    }
    // User does not exists, create a new user
    else {
      const user = req.body;
      USERS.push(user);
      res.status(200).send("User created successfully");
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
  res.status(200).send("Login successful");
});

// Fetch All UserCourses
app.get('/users/courses', authenticateUser, (req, res) => {
  // logic to list all courses
  const userCourses = COURSES.filter((course) => course.published);
  res.status(200).json({data:userCourses});
});


// Purchase Course Route
app.post('/users/courses/:courseId', authenticateUser, checkValidUserCourse, (req, res) => {
  // logic to purchase a course
  
  const userName = req.headers.username;
  const courseID = parseInt(req.params.courseId);
  // If user key exists
  if(purchasedCourses[userName]) {
      // If course not purchased
    if(!checkUserCoursePurchased(userName, courseID)) {
      purchasedCourses[userName].push(courseID);
      res.status(200).send("Course Purchased");
    }
    // Course already purchased
    else {
      res.status(403).send("Course already purchased");
    }
  }
  // If user key does not exist
  else {
    purchasedCourses[userName] = [courseID];
    res.status(200).send("Course Purchased");
  }

});

// Fetch All Purchased Courses
app.get('/users/purchasedCourses', authenticateUser, (req, res) => {
  // logic to view purchased courses
  let purchasedCourseIDs = new Set(purchasedCourses[req.headers.username]);
  if(purchasedCourseIDs.size==0) {
    res.status(200).json({purchasedCourses:[]});
  }
  else {

    const purchasedCourses = COURSES.reduce((acc, course) => {
      if(purchasedCourseIDs.has(course.id)) {
        acc.push(course);
      }
      else{
      }
      return acc;
    }, []);
    res.status(200).json({purchasedCourses:purchasedCourses});
  }
  
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

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });
