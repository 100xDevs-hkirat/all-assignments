// const { v4: uuidv4 } = require("uuid");
// const express = require("express");
// const app = express();

// app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];
// let PURCHASEDCOURSE = [];

// // findIndex function

// function findIndex(arr, id) {
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] === id) {
//       return i;
//     }
//   }
//   return -1;
// }

// // Admin routes
// app.post("/admin/signup", (req, res) => {
//   // logic to sign up admin
//   const admin = req.body;
//   let adminExists = false;
//   for (const eachAdmin of ADMINS) {
//     if (eachAdmin.username === admin.username) {
//       adminExists = true;
//       break;
//     }
//   }
//   if (adminExists) {
//     res.sendStatus(400);
//   } else {
//     ADMINS.push(admin);
//     res.status(201).json({ message: "Admin created successfully" });
//   }
// });

// app.post("/admin/login", (req, res) => {
//   // logic to log in admin
//   const admin = req.headers;
//   let adminExists = false;
//   for (const eachAdmin of ADMINS) {
//     if (
//       eachAdmin.username === admin.username &&
//       eachAdmin.password === admin.password
//     ) {
//       adminExists = true;
//       break;
//     }
//   }
//   if (adminExists) {
//     res.status(200).json({ message: "Logged in successfully" });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.post("/admin/courses", (req, res) => {
//   // logic to create a course
//   const admin = req.headers;
//   const course = req.body;
//   let adminExists = false;
//   for (const eachAdmin of ADMINS) {
//     if (
//       eachAdmin.username === admin.username &&
//       eachAdmin.password === admin.password
//     ) {
//       adminExists = true;
//       break;
//     }
//   }
//   if (adminExists) {
//     course.id = uuidv4();
//     COURSES.push(course);
//     res
//       .status(201)
//       .json({ message: "Course created successfully", courseId: course.id });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.put("/admin/courses/:courseId", (req, res) => {
//   // logic to edit a course
//   const admin = req.headers;
//   let adminExists = false;
//   for (const eachAdmin of ADMINS) {
//     if (
//       eachAdmin.username === admin.username &&
//       eachAdmin.password === admin.password
//     ) {
//       adminExists = true;
//       break;
//     }
//   }
//   if (adminExists) {
//     const courseIndex = findIndex(COURSES, req.params.courseId);
//     let updatedCourse = {
//       id: req.params.courseId,
//       title: req.body.title,
//       description: req.body.description,
//       price: req.body.price,
//       published: req.body.published,
//     };
//     COURSES[courseIndex] = updatedCourse;
//     res.status(200).json({ message: "Course updated successfully" });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.get("/admin/courses", (req, res) => {
//   // logic to get all courses
//   const admin = req.headers;
//   let adminExists = false;
//   for (const eachAdmin of ADMINS) {
//     if (
//       eachAdmin.username === admin.username &&
//       eachAdmin.password === admin.password
//     ) {
//       adminExists = true;
//       break;
//     }
//   }
//   if (adminExists) {
//     res.status(200).json({ courses: COURSES });
//   } else {
//     res.sendStatus(400);
//   }
// });

// // User routes
// app.post("/users/signup", (req, res) => {
//   // logic to sign up user
//   const user = req.body;
//   let userExists = false;
//   for (const eachUser of USERS) {
//     if (eachUser.username === user.username) {
//       userExists = true;
//       break;
//     }
//   }
//   if (userExists) {
//     res.sendStatus(400);
//   } else {
//     USERS.push(user);
//     res.status(201).json({ message: "User created successfully" });
//   }
// });

// app.post("/users/login", (req, res) => {
//   // logic to log in user
//   const user = req.headers;
//   let userExists = false;
//   for (const eachUser of USERS) {
//     if (eachUser.username === user.username) {
//       userExists = true;
//       break;
//     }
//   }
//   if (userExists) {
//     res.status(200).json({ message: "Logged in successfully" });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.get("/users/courses", (req, res) => {
//   // logic to list all courses
//   const user = req.headers;
//   let userExists = false;
//   for (const eachUser of USERS) {
//     if (
//       eachUser.username === user.username &&
//       eachUser.password === user.password
//     ) {
//       userExists = true;
//       break;
//     }
//   }
//   if (userExists) {
//     res.status(200).json({ courses: COURSES });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.post("/users/courses/:courseId", (req, res) => {
//   // logic to purchase a course
//   const user = req.headers;
//   let userExists = false;
//   for (const eachUser of USERS) {
//     if (
//       eachUser.username === user.username &&
//       eachUser.password === user.password
//     ) {
//       userExists = true;
//       break;
//     }
//   }
//   if (userExists) {
//     let courseIndex = findIndex(COURSES, req.params.courseId);
//     const newCourse = {
//       id: uuidv4(),
//       title: COURSES[courseIndex].title,
//       description: COURSES[courseIndex].description,
//       price: COURSES[courseIndex].price,
//       published: COURSES[courseIndex].published,
//     };
//     PURCHASED_COURSES.push(newCourse);
//     res.status(200).json({ message: "Course purchased successfully" });
//   }
// });

// app.get("/users/purchasedCourses", (req, res) => {
//   // logic to view purchased courses
//   const user = req.headers;
//   let userExists = false;
//   for (const eachUser of USERS) {
//     if (
//       eachUser.username === user.username &&
//       eachUser.password === user.password
//     ) {
//       userExists = true;
//       break;
//     }
//   }
//   if (userExists) {
//     res.status(200).json({ purchasedCourses: PURCHASED_COURSES });
//   } else {
//     res.sendStatus(400);
//   }
// });

// app.all("*", (req, res) => {
//   res.sendStatus(404);
// });

// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });

// harkirat solution

// const express = require("express");
// const app = express();

// app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// // user authentication middleware

// const userAuthentication = (req, res, next) => {
//   const { username, password } = req.headers;
//   const userFound = USERS.find(
//     (eachUser) =>
//       eachUser.username === username && eachUser.password === password
//   );
//   if (userFound) {
//     req.user = userFound; // add user to request object
//     next();
//   } else {
//     res.status(403).json({ message: "User authentication failed" });
//   }
// };

// // admin authentication middleware

// const adminAuthentication = (req, res, next) => {
//   const { username, password } = req.headers; // or const username = req.headers.username; const password = req.headers.password;
//   const adminExists = ADMINS.find(
//     (eachAdmin) =>
//       eachAdmin.username === username && eachAdmin.password === password
//   );
//   if (adminExists) {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin authentication failed" });
//   }
// };

// // Admin routes
// app.post("/admin/signup", (req, res) => {
//   // logic to sign up admin
//   const admin = req.body;
//   const adminExists = ADMINS.find(
//     (eachAdmin) => eachAdmin.username === admin.username
//   );
//   if (adminExists) {
//     res.status(403).json({ message: "Admin already exists" });
//   } else {
//     ADMINS.push(admin);
//     res.status(201).json({ message: "Admin created successfully" });
//   }
// });

// app.post("/admin/login", adminAuthentication, (req, res) => {
//   // logic to log in admin
//   res.status(200).json({ message: "Logged in successfully" });
// });

// app.post("/admin/courses", adminAuthentication, (req, res) => {
//   // logic to create a course
//   const course = req.body;
//   // if (!course.title || !course.description || !course.price) {
//   //   res.status(400).json({ message: "Course details missing" });
//   // }
//   course.id = Date.now();
//   COURSES.push(course);
//   res
//     .status(201)
//     .json({ message: "Course created successfully", courseId: course.id });
// });

// app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
//   // logic to edit a course
//   const courseId = parseInt(req.params.courseId);
//   const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
//   if (course) {
//     Object.assign(course, req.body);
//     // object.assign is used to merge two objects if multiple properties are present in the request body of same property name then the last one will be considered as the value of that property for example
//     /*
//     const target = {};
//     const source1 = { name: 'John', age: 30 };
//     const source2 = { age: 35, profession: 'Engineer' };

//     Object.assign(target, source1, source2);

//     console.log(target); // { name: 'John', age: 35, profession: 'Engineer' }
//     */
//     // or the above can be done as course.title = req.body.title; course.description = req.body.description; course.price = req.body.price;
//     res.status(200).json({ message: "Course updated successfully" });
//   } else {
//     res.status(404).json({ message: "Course not found" });
//   }
// });

// app.get("/admin/courses", adminAuthentication, (req, res) => {
//   // logic to get all courses
//   res.json({ courses: COURSES });
// });

// // User routes
// app.post("/users/signup", (req, res) => {
//   // logic to sign up user
//   // const user = {
//   //   username: req.body.username,
//   //   password: req.body.password,
//   //   purchasedCourses: []
//   // };
//   //or the above line can be written as
//   const user = { ...req.body, purchasedCourses: [] };
//   // The syntax you provided, const user = { ...req.body, purchasedCourses: [] };, is an example of object spread syntax in JavaScript. It is a shorthand way of creating a new object by copying the properties of an existing object (req.body in this case) and adding additional properties or modifying existing ones.
//   USERS.push(user); // we dont check if the user already exists in signup so that user can signup with same username and password again but not for admin
//   res.status(201).json({ message: "User created successfully" });
// });

// app.post("/users/login", userAuthentication, (req, res) => {
//   // logic to log in user
//   res.json({ message: "Logged in successfully" });
// });

// app.get("/users/courses", userAuthentication, (req, res) => {
//   // logic to list all courses
//   // filtered courses
//   res.json({ courses: COURSES.filter((eachCourse) => eachCourse.published) });
//   // show only those courses which are published

//   //it can also be written as
//   // const filteredCourses = [];
//   // for ( let i = 0; i < COURSES.length; i++) {
//   //   if (COURSES[i].published) {
//   //     filteredCourses.push(COURSES[i]);
//   //   }
//   // return res.json({ courses: filteredCourses });
//   // }
// });

// app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
//   // logic to purchase a course
//   const courseId = parseInt(req.params.courseId);
//   const course = COURSES.find(
//     (eachCourse) => eachCourse.id === courseId && eachCourse.published
//   );
//   if (course) {
//     req.user.purchasedCourses.push(courseId); // purchasedCourse was made in user signup so we can access it from req.user which was added in userAuthentication middleware which has user username and password and in purchasedCourses we push the course
//     // in this case the req.user was made in userAuthentication middleware which got its value from userFound variable above in authentication the userFound variable was made by finding the user in USERS array. now when we make changes in req.user it will be reflected in USERS array as well since its reference type change in one will change the other in USERS array
//     // purchasedCourses contains the ids of the courses purchased by the user
//     res.status(200).json({ message: "Course purchased successfully" });
//   } else {
//     res.status(404).json({ message: "Course not found or not available" });
//   }
// });

// app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
//   // logic to view purchased courses
//   // const purchasedCoursesIds = req.user.purchasedCourses;
//   // const purchasedCourses = [];
//   // for(let i = 0; i < COURSES.length; i++) {
//   //   if (purchasedCoursesIds.indexof[COURSES[i].id] !== -1) {   // means if the courses id from COURSES array is present in purchasedCoursesIds array then it will be pushed in purchasedCourses array else it will return -1 and will be ignored
//   //     purchasedCourses.push(COURSES[i]);
//   //   }
//   // }
//   //else in one line above code can be written as
//   const purchasedCourses = COURSES.filter((eachCourse) =>
//     req.user.purchasedCourses.includes(eachCourse.id)
//   );
//   res.json({ purchasedCourses });
// });

// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });

//my try

const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next) {
  const { username, password } = req.headers;
  const adminFound = ADMINS.find(
    (eachAdmin) =>
      eachAdmin.username === username && eachAdmin.password === password
  );
  if (adminFound) {
    next();
  } else {
    res.status(403).json({ message: "Admin not found" });
  }
}

function userAuthentication(req, res, next) {
  const { username, password } = req.headers;
  const userFound = USERS.find(
    (eachUser) =>
      eachUser.username === username && eachUser.password === password
  );
  if (userFound) {
    req.user = userFound;
    next();
  } else {
    res.status(403).json({ message: "User not found" });
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const adminFound = ADMINS.find(
    (eachAdmin) => eachAdmin.username === admin.username
  );
  if (adminFound) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.status(201).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: "Admin logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res
    .status(201)
    .json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
  if (course) {
    Object.assign(course, req.body); // object.assign is used to copy the properties from one object to another object while keeping the reference of the object same and also keeping the properties of the object which are not copied as it is
    res.status(200).json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ Courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCourses: [] };
  USERS.push(user);
  res.status(201).json({ message: "User created successfully" });
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.status(200).json({ message: "User logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((eachCourse) => eachCourse.published) });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.status(200).json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((eachCourse) =>
    req.user.purchasedCourses.includes(eachCourse.id)
  );
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
