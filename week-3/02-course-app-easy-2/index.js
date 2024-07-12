// const express = require('express');
// const app = express();

// app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// // Admin routes
// app.post('/admin/signup', (req, res) => {
//   // logic to sign up admin
// });

// app.post('/admin/login', (req, res) => {
//   // logic to log in admin
// });

// app.post('/admin/courses', (req, res) => {
//   // logic to create a course
// });

// app.put('/admin/courses/:courseId', (req, res) => {
//   // logic to edit a course
// });

// app.get('/admin/courses', (req, res) => {
//   // logic to get all courses
// });

// // User routes
// app.post('/users/signup', (req, res) => {
//   // logic to sign up user
// });

// app.post('/users/login', (req, res) => {
//   // logic to log in user
// });

// app.get('/users/courses', (req, res) => {
//   // logic to list all courses
// });

// app.post('/users/courses/:courseId', (req, res) => {
//   // logic to purchase a course
// });

// app.get('/users/purchasedCourses', (req, res) => {
//   // logic to view purchased courses
// });

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });

///I have already done jwt in easy assignment only 
// const express = require('express');
import express from "express";
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
const app = express();

app.use(express.json());

let ADMINS = [{
  id: 1, adminName: "adminName", adminPassword: "adminPassword", courses: [], amount: 0
}];
let USERS = [{
  id: 1, userName: "userName", userPassword: "userPassword", courses: []
}
];
let COURSES = [{
  id: 1, courseName: "courseName", courseDetails: "courseDetails", authorId: 1, amount: 10
}];
const jwt_secret_token = "CoUr$eTOkeN";

function generateToken(data) {
  return jwt.sign(data, jwt_secret_token);
}

function verifyToken(data) {
  return jwt.verify(data, jwt_secret_token);
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { adminName, adminPassword } = req.body;

  if ((adminName && adminName.length <= 0) || (adminPassword && adminPassword.length <= 0)) {
    res.status(400).send({ statusCode: 0, message: "One or more Fields are Empty" });
    return;
  }
  var isAlreadyAdmin = ADMINS.find((eachEle => eachEle.adminName == adminName));
  if (isAlreadyAdmin) {
    res.send({ statusCode: 0, message: "User Name Already Exist Please Login", });
    return;
  }
  var adminData = {
    id: uuidv4(),
    adminName: adminName,
    adminPassword: adminPassword,
    courses: [],
    amount: 0
  };
  ADMINS.push(adminData);
  res.send({ statusCode: 1, message: "User Signup successfully", id: adminData.id, token: generateToken({ adminName: adminData.adminName, adminPassword: adminData.adminPassword }) });


});


app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { adminName, adminPassword } = req.body;
  var isAdmin = ADMINS.find((admin => (admin.adminName === adminName && admin.adminPassword == adminPassword)));
  if (isAdmin) {
    res.send({ statusCode: 1, data: isAdmin, token: generateToken(isAdmin) })
  } else {

    res.send({ statusCode: 0, message: "User Not Found" });
  }
});

const adminMidddleware = (req, res, next) => {
  const token = req.headers.token;
  const { adminName, adminPassword } = verifyToken(token);
  var admin = ADMINS.find((adm => adm.adminName === adminName && adm.adminPassword === adminPassword));
  if (admin) {
    req.user = admin;
    next();
  } else {
    res.status(403).send({ statusCode: 0, message: "Unauthorised" });
  }
}

app.post('/admin/courses', adminMidddleware, (req, res) => {
  // logic to create a course
  const { courseName, courseDetails, amount } = req.body;
  var createdCourse = {
    id: uuidv4(), courseName: courseName, courseDetails: courseDetails, authorId: req.user.id, amount: amount
  };

  COURSES.push(createdCourse);
  req.user.courses.push(createdCourse.id);

  res.send({ statusCode: 1, message: "Added", data: req.user })
});

app.put('/admin/courses/:courseId', adminMidddleware, (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const { courseName, courseDetails } = req.body;

  var isHisCourseId = req.user.courses.find((cou) => (cou === courseId));
  if (isHisCourseId) {
    var broughtCourse = COURSES.find((cous) => (cous.id === courseId));
    broughtCourse.courseName = courseName;
    broughtCourse.courseDetails = courseDetails;

    res.send({ statusCode: 1, data: broughtCourse })
  } else {
    res.send({ statusCode: 0, message: "You Have not brought this course" })
  }
});

app.get('/admin/courses', adminMidddleware, (req, res) => {
  // logic to get all courses
  if (req.user.courses.length > 0) {
    var adminCoursesId = req.user.courses;
    let allCoursesDetails = [];
    var allAdminCourses = adminCoursesId.forEach((eachCour => {
      var courseFinded = COURSES.find((cour) => (eachCour === cour.id));
      if (courseFinded) {
        allCoursesDetails.push(courseFinded);
      }
    }))
    res.send({ statusCode: 1, data: allCoursesDetails });
  } else {
    res.send({ statusCode: 0, message: "Make Courses to see here" })
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { userName, userPassword } = req.body;

  if ((userName && userName.length <= 0) || (userPassword && userPassword.length <= 0)) {
    res.status(400).send({ statusCode: 0, message: "One or more fields are Empty" });
    return;
  }
  var userPresent = USERS.find((usr) => (usr.userName === userName));
  if (userPresent) {
    res.send({ statusCode: 0, message: "User Aleady Found" });
  } else {
    let userData = {
      id: uuidv4(),
      userName: userName,
      userPassword: userPassword,
      courses: []
    }
    USERS.push(userData);
    res.send({ statusCode: 1, id: userData.id, token: generateToken({ userName: userData.userName, userPassword: userData.userPassword }) })
  }


});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { userName, userPassword } = req.body;
  if ((userName && userName.length <= 0) || (userPassword && userPassword.length <= 0)) {
    res.status(400).send({ statusCode: 0, message: "One or more fields are Empty" });
    return;
  }
  var isUserPresent = USERS.find((urs) => (urs.userName === userName && urs.userPassword === userPassword));
  if (isUserPresent) {
    res.send({ statusCode: 1, data: isUserPresent, token: generateToken({ userName: isUserPresent.userName, userPassword: isUserPresent.userPassword }) })

  } else {
    res.send({ statusCode: 0, message: "Invalid User Details" })
  }
});

const userMiddleware = (req, res, next) => {
  const token = req.headers.token;
  const { userName, userPassword } = verifyToken(token);

  let isUserPresent = USERS.find((urs) => (urs.userName === userName && urs.userPassword === userPassword));
  if (isUserPresent) {
    req.user = isUserPresent;
    next();
  } else {
    res.status(403).send({ statusCode: 0, message: "Unauthorised" });
  }
}

app.get('/users/courses', userMiddleware, (req, res) => {
  // logic to list all courses
  res.send({ statusCode: 1, data: COURSES });
});

app.post('/users/courses/:courseId', userMiddleware, (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  req.user.courses.push(courseId);

  var courseDetail = COURSES.find((cor) => (cor.id === courseId));
  if (courseDetail) {
    var author = ADMINS.find((adm) => (adm.id === courseDetail.authorId));
    author.amount = author.amount + courseDetail.amount;
  }

  res.send({ statusCode: 1, message: "Course Added Successfully" });
});

app.get('/users/purchasedCourses', userMiddleware, (req, res) => {
  // logic to view purchased courses
  var purchasedCoursesId = req.user.courses;
  if (purchasedCoursesId.length > 0) {

    let purchasedCourses = [];
    purchasedCoursesId.forEach((cour) => {
      var isPurched = COURSES.find((ele) => ele.id === cour);
      if (isPurched) {
        purchasedCourses.push(isPurched);
      }
    });
    res.send({ statusCode: 1, data: purchasedCourses });

  } else {

    res.send({ statusCode: 0, message: "Buy some courses to see heres" });
  }

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
