// const express = require("express");
// const jwt = require("jsonwebtoken");
// const app = express();

// app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// const secretKey = "Your_secret_key";

// const generateJwt = (user) => {
//   const payload = { username: user.username };
//   return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // we create a token for the current user and send it to the client and the client will send it back to the server for future requests it will be verified by the server and aslo expires in 1 hour and will be regenerated again after 1 hour in this case so we dont have to send username and password everytime to the server
// };

// // middleware authenticateJwt

// const authenticateJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization; // headers.authorization is where we will get the token but it will have Bearer space token so we need to remove the Bearer space from the token to get the actual token

//   if (authHeader) {
//     // to check if the token is present or not
//     const token = authHeader.split(" ")[1]; // since at 0th index we will have Bearer and since we split on the basis of space so on 1st index we will have the token

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // if the token is not verified then we will send 403 status code
//       }
//       req.user = user; // if the token is verified then we will set the user in the request object
//       next(); // we will call the next middleware
//     });
//   } else {
//     res.sendStatus(401); // if the token is not present then we will send 401 status code
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
//     const token = generateJwt(admin); // we create a token for the current admin
//     res.status(201).json({ message: "Admin created successfully", token }); // we send the token to the client
//   }
// });

// app.post("/admin/login", (req, res) => {
//   // logic to log in admin
//   const { username, password } = req.headers;
//   const admin = ADMINS.find(
//     (eachAdmin) =>
//       eachAdmin.username === username && eachAdmin.password === password
//   ); // now that we have checked the username and password we can create a token now to send to the client for future requests and verify only the token instead of sending username and password everytime to the server
//   if (admin) {
//     const token = generateJwt(admin); // we create a token for the current admin when he logs in
//     res.status(200).json({ message: "Logged in successfully", token }); // we send the token to the client
//   } else {
//     res.status(403).json({ message: "Admin authentication failed" });
//   }
// });

// app.post("/admin/courses", authenticateJwt, (req, res) => {
//   // logic to create a course
//   const course = req.body;
//   course.id = COURSES.length + 1;
//   COURSES.push(course);
//   res
//     .status(201)
//     .json({ message: "Course created successfully", courseId: course.id });
// });

// app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
//   // logic to edit a course
//   const courseId = parseInt(req.params.courseId);
//   const courseIndex = COURSES.findIndex(
//     (eachCourse) => eachCourse.id === courseId
//   );

//   if (courseIndex > -1) {
//     const updatedCourse = { ...COURSES[courseIndex], ...req.body };
//     COURSES[courseIndex] = updatedCourse;
//     res.status(200).json({ message: "Course updated successfully" });
//   } else {
//     res.status(404).json({ message: "Course not found" });
//   }
// });

// app.get("/admin/courses", authenticateJwt, (req, res) => {
//   // logic to get all courses
//   res.json({ courses: COURSES });
// });

// // User routes
// app.post("/users/signup", (req, res) => {
//   const user = req.body;
//   const userExists = USERS.find(
//     (eachUser) => eachUser.username === user.username
//   );
//   if (userExists) {
//     res.status(403).json({ message: "User already exists" });
//   } else {
//     USERS.push(user);
//     const token = generateJwt(user);
//     res.status(201).json({ message: "User created successfully", token });
//   }
// });

// app.post("/users/login", (req, res) => {
//   const { username, password } = req.headers;
//   const user = USERS.find(
//     (eachUser) =>
//       eachUser.username === username && eachUser.password === password
//   );
//   if (user) {
//     const token = generateJwt(user);
//     res.status(200).json({ message: "Logged in successfully", token });
//   } else {
//     res.status(403).json({ message: "User authentication failed" });
//   }
// });

// app.get("/users/courses", authenticateJwt, (req, res) => {
//   res.json({ courses: COURSES.filter((eachCourse) => eachCourse.published) });
// });

// app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
//   // logic to purchase a course
//   const courseId = parseInt(req.params.courseId);
//   const course = COURSES.find(
//     (eachCourse) => eachCourse.id === courseId && eachCourse.published
//   );
//   if (course) {
//     const user = USERS.find(
//       (eachUser) => eachUser.username === req.user.username // here the req.user only has the username and not the password  so we need to find the user with the username in the USERS array this is good for security purposes since req.user is not global and can be accessed only in the current request this req.user or the user was created in the authenticateJwt middleware in if (user) { req.user = user; next(); so this user  got it from token decrypted and this was formed using secret key and user name so hence it has only the username.
//     );
//     if (user) {
//       if (!user.purchasedCourses) {
//         user.purchasedCourses = [];
//       }
//       user.purchasedCourses.push(course);
//       res.status(200).json({ message: "Course purchased successfully" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } else {
//     res.status(404).json({ message: "Course not found or not available" });
//   }
// });

// app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
//   // const purchasedCourses = COURSES.filter((eachCourse) =>
//   //   req.user.purchasedCourses.includes(eachCourse.id)  // req.user is no longer a part of global USERS variable it is the part of the decoded jwt so we need to find the user in the USERS array and then check for the purchased courses
//   // );
//   // res.json({ purchasedCourses });

//   const user = USERS.find(
//     (eachUser) => eachUser.username === req.user.username
//   );
//   if (user && user.purchasedCourses) {
//     res.json({ purchasedCourses: user.purchasedCourses });
//   } else {
//     res.status(404).json({ message: "No courses purchased" });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });

// // here in this code there is bug the user and admin are having same secret key so if a user can signup as a user but still can hit admin routes
// // solution is to have two different genearteJwt functions one for user and one for admin with two different secret key like generateUserJwt and generateAdminJwt

// // also two different verifications middleware for user and admin like verifyUserJwt and verifyAdminJwt logic will be same just token will differ based on the secret key

// my try
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const SECRET_KEY_ADMIN = "Ac1min@123";
const SECRET_KEY_USER = "Us3r@123";

// authenticating user middleware

const userAuthJwt = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, SECRET_KEY_USER, (err, user) => {
      if (err) {
        res.status(403).json({ message: "User authentication failed" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).json({ message: "User not present" });
  }
};

//authenticating admin middleware

const adminAuthJwt = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, SECRET_KEY_ADMIN, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Admin authentication failed" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).json({ message: "Admin not present" });
  }
};

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
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      SECRET_KEY_ADMIN,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (eachAdmin) =>
      eachAdmin.username === username && eachAdmin.password === password
  );
  if (admin) {
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      SECRET_KEY_ADMIN,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", adminAuthJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res
    .status(201)
    .json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.status(200).json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }

  /*or
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(eachCourse => eachCourse.id === courseId);
  if (courseIndex > -1) {
    const updateCourse = {...COURSES[courseIndex], ...req.body};
    COURSES[courseIndex] = updateCourse;
    res.status(200).json({ message: "Course updated successfully" });
  }else {
    res.status(404).json({ message: "Course not found" });
  }
  */
});

app.get("/admin/courses", adminAuthJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const userFound = USERS.find(
    (eachUser) => eachUser.username === user.username
  );
  if (userFound) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    const token = jwt.sign(
      { username: user.username, role: "user" },
      SECRET_KEY_USER,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (eachUser) =>
      eachUser.username === username && eachUser.password === password
  );
  if (user) {
    const token = jwt.sign(
      { username: username, role: "user" },
      SECRET_KEY_USER,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", userAuthJwt, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((eachCourse) => eachCourse.published) });
});

app.post("/users/courses/:courseId", userAuthJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
  if (course) {
    const user = USERS.find(
      (eachUser) => eachUser.username === req.user.username
    );
    if (user) {
      if (!user.purchaseCourses) {
        user.purchaseCourses = [];
      } else {
        user.purchaseCourses.push(course);
        res.status(200).json({ message: "Course purchased successfully" });
      }
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(403).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", userAuthJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(
    (eachUser) => eachUser.username === req.user.username
  );
  if (user && user.purchaseCourses) {
    res.json({ courses: user.purchaseCourses });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
