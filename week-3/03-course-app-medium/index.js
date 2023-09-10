const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require("fs");

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

let ADMINS = [];
let USERS = [];
let COURSES = [];
let purchasedCourses = [];

const adminJsonPath = './data/admins.json';
const courseJsonPath = './data/courses.json';
const usersJsonPath = './data/users.json';
const purchasedCoursesJson = './data/purchasedCourses.json';
const refreshData = async () => {
  try {
    ADMINS = JSON.parse(fs.readFileSync(adminJsonPath, 'utf8'));
    USERS = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));
    COURSES = JSON.parse(fs.readFileSync(courseJsonPath, 'utf8'));
    purchasedCourses = JSON.parse(fs.readFileSync(purchasedCoursesJson, 'utf8'));
  } catch {
    ADMINS = [];
    USERS = [];
    COURSES = [];
    purchasedCourses = [];
  }
};

refreshData();


function getCourseID() {
  return Math.floor(Date.now()/100);
}

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

const getJWT = (username, jwtSecret) => {
  const payload = {
    username:username,
  };
  return jwt.sign( 
    payload,
    jwtSecret,
    {expiresIn:'1h'}
  );
};

const getAdminJWT = (username) => {
  return getJWT(username, jwtSecretAdmin);
}

const getUserJWT = (username) => {
  return getJWT(username, jwtSecretUser);
}

const authenticateAdminJwt = (req, res, next) => {
  if(req.headers.authorization) {
    const authHeader = req.headers.authorization.split(" ")[1]; 
    if(authHeader) {
      if(jwt.verify(authHeader, jwtSecretAdmin, (err, user) => {

        if(err) {
          return res.status(403).send("Unauthorized");
        }
        req.user = user;
        next();

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
        req.user = user;
        next();

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

function authenticateAdmin(req, res, next) {
  if("username" in req.headers && "password" in req.headers){
    
    // If creds correct
    if(checkLogin(req.headers.username, req.headers.password)) {
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


// Admin routes

// Admin Sign Up Route

app.post('/refreshData', (req, res) => {
  refreshData();
  res.sendStatus(200);
});

app.post('/admin/signup', (req, res) => {

  if("username" in req.body && "password" in req.body){
    if(!adminExists(req.body.username, req.body.password)){
      const admin = {
        username:req.body.username,
        password:req.body.password
      };
      ADMINS.push(admin);
      fs.writeFile(adminJsonPath, JSON.stringify(ADMINS), (err, data) => {
        if(err) {
          res.status(500).send("Something went wrong");
        }
        res.status(200).json({message:"Admin created successfully"});
      });
      
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
app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;

  // Title not provided
  if(!course.title || !course.description || !course.price || !course.imageLink || !("published" in course)) {
    res.status(403).send("Missing course params");
  }
  course.id = getCourseID();
  COURSES.push(course);
  fs.writeFile(courseJsonPath, JSON.stringify(COURSES), (err, data) => {
    if(err) {
      res.status(500).send("Something went wrong");
    }
    res.status(200).send({message:"Course Added Successfully", course:course.id});
  });

});


// Udpate Course Route
app.put('/admin/courses/:courseId', authenticateAdminJwt, findCourse, updateCourse, (req, res) => {
  // logic to edit a course
  COURSES.map((course) => {
    if(course.id == req.params.courseId) {
      course = req.course;
    }
    return course;
  });
  fs.writeFile(courseJsonPath, JSON.stringify(COURSES), (err, data) => {
    if(err) {
      res.status(500).send("Something went wrong");
    }
    res.status(200).send({message:"Course Added Successfully", course:req.course});
  });
});

// Delete course
app.delete('/admin/courses/:courseId', authenticateAdminJwt, findCourse, (req, res) => {
  COURSES = COURSES.filter((course) => {
    return course.id != req.params.courseId;
  });
  fs.writeFile(courseJsonPath, JSON.stringify(COURSES), (err, data) => {
    if(err) {
      res.status(500).send("Something went wrong");
    }
    res.status(200).send({message:"Course Deleted Successfully"});
  });
});

// All Courses Route
app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.status(200).json({data:COURSES});
});

// Functions
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
      fs.writeFile(usersJsonPath, JSON.stringify(USERS), (err, data) => {
        if(err) 
          res.status(500).send("Something went wrong");

        res.status(200).send("User created successfully");
      });
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
app.get('/users/courses', authenticateUserJwt, (req, res) => {
  // logic to list all courses
  const userCourses = COURSES.filter((course) => course.published);
  res.status(200).json({courses:userCourses});
});


// Purchase Course Route
app.post('/users/courses/:courseId', authenticateUserJwt, checkValidUserCourse, (req, res) => {
  // logic to purchase a course
  
  const userName = req.user.username;
  const courseID = parseInt(req.params.courseId);
  // If user key exists
  if(purchasedCourses[userName]) {
      // If course not purchased
    if(!checkUserCoursePurchased(userName, courseID)) {
      purchasedCourses[userName].push(courseID);
    }
    // Course already purchased
    else {
      return res.status(403).send("Course already purchased");
    }
  }
  // If user key does not exist
  else {
    purchasedCourses[userName] = [courseID];
  }

  // Write back to purchasedCourses.json
  fs.writeFile(purchasedCoursesJson, JSON.stringify(purchasedCourses), (err, data) => {
    if(err) 
      return res.sendStatus(500);

    res.status(200).send("Course Purchased");
  });

});

// Fetch All Purchased Courses
app.get('/users/purchasedCourses', authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  let purchasedCourseIDs = new Set(purchasedCourses[req.user.username]);
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

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
