
const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes

function adminAuth (req, res, next) {
  const {username, password} = req.headers;

  //OR
  //const username = req.headers.username;
  //const password = req.headers.password;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin) {
    next();
  } else {
    res.status(403).json({message : "Wrong credentials"});
  }
}

function userAuth (req, res, next) {
  const {username, password} = req.headers;
  const user = USERS.find(a => a.username === username && a.password === password);

  if (user) {
    req.user = user // add user object to the request
    next();
  } else {
    res.status(403).json({message : "Wrong credentials"});
  }
}

app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if(existingAdmin) {
    res.status(403).json({message : "admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({message : "admin created successfully"});
  }
});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res.json({message : 'Logged in successfully'});
});

app.post('/admin/courses', adminAuth, (req, res) => {
  // logic to create a course
  const course = req.body;
  if(!course.title) {
    res.status(411).json({ message : 'course title can not be empty'});
  }
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  // logic to edit a course
  if(!req.body.title) {
    res.status(411).json({ message : 'course title can not be empty'});
  }
  const courseID = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseID);
  if(course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({message : 'Course not found'});
  }
});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  res.json({courses : COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user

  const user = {
    username : req.body.username,
    password : req.body.password,
    purchasedCourses : []
  }

  // OR

  // const user = {...req.body, purchasedCourses: []};
  USERS.push(user);
  res.json({ message : 'User created successfully' });
});

app.post('/users/login', userAuth, (req, res) => {
  // logic to log in user

  // console.log(req.user);
  // console.log(req.headers.password);

  res.json({message: 'Logged in successfully' });

});

app.get('/users/courses', userAuth , (req, res) => {
  // logic to list all courses

  // let filteredCourses = [];
  // for (let i = 0; i < COURSES.length; i++) {
  //   if(COURSES[i].published) {
  //     filteredCourses.push(COURSES[i]);
  //   }
  // }

  // filteredCourses is equivalent to COURSES.filter(c => c.published)

  res.json({ courses : COURSES.filter(c => c.published)});
});

app.post('/users/courses/:courseId', userAuth, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if(course) {
    req.user.purchasedCourses.push(courseId);
    res.json( { message: 'Course purchased successfully' });
  } else {
    res.status(404).json( { message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', userAuth,  (req, res) => {
  // logic to view purchased courses
  let purchasedCoursesIds = req.user.purchasedCourses;
  let purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if(purchasedCoursesIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  // OR
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));

  res.json({purchased : purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});


// MINE SOLUTION

// const express = require('express');
// const app = express();
//
// app.use(express.json());
//
// let ADMINS = [];
// let USERS = [];
// let COURSES = [];
// let Id = 1;
//
// // Admin routes
// app.post('/admin/signup', (req, res) => {
//   // logic to sign up admin
//   const username = req.body.username;
//   const password = req.body.password;
//   ADMINS.push({
//     username : username,
//     password : password
//   })
//   res.send("Admin created successfully");
// });
//
// app.post('/admin/login', (req, res) => {
//   // logic to log in admin
//   const username = req.headers.username;
//   const password = req.headers.password;
//   let userExists = false;
//
//   for (let i = 0; i < ADMINS.length; i++) {
//     if(ADMINS[i].username === username && ADMINS[i].password === password){
//       userExists = true;
//     }
//   }
//
//   if(userExists) {
//     res.send("Logged in successfully");
//   } else {
//     res.status(400).send("User do not exist signup first");
//   }
// });
//
// app.post('/admin/courses', (req, res) => {
//   // logic to create a course
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const course = req.body;
//   let userExists = false;
//
//   for (let i = 0; i < ADMINS.length; i++) {
//     if(ADMINS[i].username === username && ADMINS[i].password === password){
//       userExists = true;
//     }
//   }
//
//   if(userExists) {
//     COURSES.push({
//       courseId : Id,
//       title : course.title,
//       description : course.description,
//       price : course.price,
//       imageLink : course.imageLink,
//       published : course.published
//     });
//     res.send({
//       message : "Course created successfully",
//       courseId : Id++
//     })
//   } else {
//     res.status(400).send("Your are not a admin");
//   }
// });
//
// app.put('/admin/courses/:courseId', (req, res) => {
//   // logic to edit a course
//   const courseId = req.params.courseId;
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const course = req.body;
//   let userExists = false;
//   // let courseExists = false;
//
//   for (let i = 0; i < ADMINS.length; i++) {
//     if(ADMINS[i].username === username && ADMINS[i].password === password){
//       userExists = true;
//     }
//   }
//   let courseIndex = 0;
//   for (let i = 0; i < COURSES.length; i++) {
//     if(COURSES[i].courseId === courseId){
//       courseIndex = i;
//       break;
//     }
//   }
//
//
//   if(userExists) {
//     COURSES[courseIndex].title = req.body.title;
//     COURSES[courseIndex].description = req.body.description;
//     COURSES[courseIndex].price = req.body.price;
//     COURSES[courseIndex].imageLink = req.body.imageLink;
//     COURSES[courseIndex].published = req.body.published;
//     res.send({
//       message : "Course updated successfully",
//     })
//   } else {
//     res.status(400).send("Your are not a admin");
//   }
//
// });
//
// app.get('/admin/courses', (req, res) => {
//   // logic to get all courses
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const course = req.body;
//   let userExists = false;
//
//   for (let i = 0; i < ADMINS.length; i++) {
//     if(ADMINS[i].username === username && ADMINS[i].password === password){
//       userExists = true;
//     }
//   }
//
//   if(userExists) {
//     res.send(COURSES);
//   } else {
//     res.status(400);
//   }
//
// });
//
// // User routes
// app.post('/users/signup', (req, res) => {
//   // logic to sign up user
//   const user = req.body;
//   USERS.push({
//     username : user.username,
//     password : user.password
//   });
//   res.send("User created successfully");
// });
//
// app.post('/users/login', (req, res) => {
//   // logic to log in user
//   const username = req.headers.username;
//   const password = req.headers.password;
//   let userExists = false;
//
//   for (let i = 0; i < USERS.length; i++) {
//     if(USERS[i].password === password && USERS[i].username === username) {
//       userExists = true;
//       break;
//     }
//   }
//
//   if(userExists) {
//     res.send("Logged in successfully");
//   } else {
//     res.status(400).send("User does not exists");
//   }
// });
//
// app.get('/users/courses', (req, res) => {
//   // logic to list all courses
//   const username = req.headers.username;
//   const password = req.headers.password;
//   let userExists = false;
//
//   for (let i = 0; i < USERS.length; i++) {
//     if(USERS[i].password === password && USERS[i].username === username) {
//       userExists = true;
//       break;
//     }
//   }
//   if(userExists) {
//     res.send(COURSES);
//   } else {
//     res.status(400).send("User does not exists");
//   }
// });
//
// app.post('/users/courses/:courseId', (req, res) => {
//   // logic to purchase a course
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const Id = req.params.courseId;
//   let userExists = false;
//   let courseExists = false;
//
//   for (let i = 0; i < USERS.length; i++) {
//     if(USERS[i].password === password && USERS[i].username === username) {
//       userExists = true;
//       break;
//     }
//   }
//
//   for (let i = 0; i < COURSES.length; i++) {
//     if(COURSES[i].courseId === Id) {
//       courseExists = true;
//       break;
//     }
//   }
//
//   if(userExists && courseExists) {
//     res.send("Course purchased successfully");
//   } else {
//     res.status(400).send("User does not exists");
//   }
// });
//
// app.get('/users/purchasedCourses', (req, res) => {
//   // logic to view purchased courses
//   const username = req.headers.username;
//   const password = req.headers.password;
//   let userExists = false;
//
//   for (let i = 0; i < USERS.length; i++) {
//     if(USERS[i].password === password && USERS[i].username === username) {
//       userExists = true;
//       break;
//     }
//   }
//
//   if(userExists) {
//     res.send(COURSES);
//   } else {
//     res.status(400).send("User does not exists");
//   }
// });
//
// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });

