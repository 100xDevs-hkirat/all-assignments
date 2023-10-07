const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretEncryption = "MyLittleSecret";

// Admins, Users login status, Instead of doing this and checking it in every route, we make use of middlewares 
// let adminLoggedIn = false;
// let userLoggedIn = false; 

// AdminJWT authentication Function
const generateAdminJWT = (admin) => {
  const payload = { username: admin.username };
  return jwt.sign(payload, secretEncryption, { expiresIn: '1h'});
}

console.log(generateAdminJWT);

// adminAuthenticateJWT
const authenticateAdminJWT = (req,res, next) => {
  const auth = req.headers.authorization;
  if (auth) {
    const encryptedData = auth.split(' ')[1];
    jwt.verify(encryptedData, secretEncryption, (err, decrypt) => {
      if (err){
        console.log(err);
      }else {
        console.log("decryptedData : ", decrypt);
        req.user = decrypt;
        next();
      }
    });
  } else {
    res.status(403).send('first register the admin before decrypted the admin auth token !');     
  }
}

//Admin Authentication MiddlesWare
const adminMiddleware = (req, res, next) => {
  const { username, password } = req.headers;
  // logic to log in admin
  let validAdmin = ADMINS.find((admin) => admin.username == username && admin.password == password)

  if (!validAdmin) {
    res.status(403).res.send("Get The F**k Out of here, come back later when you register succesfully !")    
  } else {
    next();
  }
}

//Admin Authentication MiddlesWare
const userMiddleware = (req, res, next) => {
  const { username, password } = req.headers;
  // logic to log in admin
  let validUser = USERS.find((user) => user.username == username && user.password == password)

  if (!validUser) {
    res.status(403).res.send("Get The F**k Out of here, come back later when you Login succesfully !")    
  } else {
    req.user = username; // stores the user's username in the req object which can be used the next route call 
    next();
  }
} 

// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  // logic to sign up admin
  let userExist = ADMINS.find((admin) => admin.username == username);

  if (userExist) {
    res.send('This Username Admin is Already Registered, try Different Username');
  } else {
    const token = generateAdminJWT(req.body);
    ADMINS.push({
      username, password
    })
    res.json({ message: " Admin Registered Succesfully !", token });
    req.headers.authorization = token;
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const token = generateAdminJWT(req.body);
    res.json({
      admin: req.body.username,
      message: "Welcome You are succesfully Signed In !",
      token
    })
});

app.post('/admin/courses', authenticateAdminJWT, (req, res) => {
  // logic to create a course
  // const { title, description, price, imageLink, published } = req.body;
  let courseExists = COURSES.find((course) => course.title == req.body.title);
  if (courseExists) {
    res.status(403).send("Course with this Title Already Exist");
  } else {
    let course = req.body;
    course.id = Date.now();
    COURSES.push(req.body);
    res.json({message: "Course Created Succesfully !", courseId : course.id})
  }
  
});

app.put('/admin/courses/:courseId', adminMiddleware, (req, res) => {
  // logic to edit a course
  const { title, description, price, imageLink, published } = req.body;

  let updateIndex = COURSES.findIndex((course) => course.id == req.params.courseId);
    
    if (updateIndex == -1) {
      res.send("There's No Course of that ID")
    }

  COURSES[updateIndex] = { title, description, price, imageLink, published };
  res.send("Course Updated Succesfully !")
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
    res.send(JSON.stringify(COURSES));
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCourses: []};
  // logic to sign up admin
  let userExist = USERS.find((u) => u.username == user.username);

  if (userExist) {
    res.send('This User is Already Registered, try Different Username');
  } else {
    USERS.push(user)
    res.send(username + " User Registered Succesfully !");
  }
});

app.post('/users/login', userMiddleware, (req, res) => {
  // logic to log in user
  res.json({
    user: req.body.username, 
    message: "Welcome You are succesfully Signed In !"
  })
});

app.get('/users/courses', userMiddleware, (req, res) => {
  // logic to list all courses
  req.json({course: COURSES.filter(course=>course.published)});
});

app.post('/users/courses/:courseId', (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userMiddleware, (req, res) => {
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
