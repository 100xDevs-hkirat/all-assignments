const express = require("express");
//const bodyparser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

/* const writeData = (fileName, data) => {
  fs.writeFile(`./files/${fileName}`, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
}; */

/* const readData = (fileName) => {
  fs.readFile(`./files/${fileName}`, "utf8", (err1, content) => {
    if (err1) {
      console.log("Error while reading contents of the folder: " + err1);
      return null;
    } else {
      //console.log(JSON.parse(content));
      //console.log("Content " + content);
      content = JSON.parse(content);
      if (content.length > 0) {
        switch (fileName) {
          case "ADMINS.txt":
            ADMINS = content;
            break;
          case "USERS.txt":
            USERS = content;
            break;
          case "COURSES.txt":
            COURSES = content;
            break;
        }
      }
      //console.log(TODOS);
    }
  });
};

readData("ADMINS.txt", ADMINS);
readData("USERS.txt", USERS);
readData("COURSES.txt", COURSES);

 */ /* console.log("Admins " + JSON.stringify(ADMINS));
console.log("Users " + JSON.stringify(USERS));
console.log("Courses " + JSON.stringify(COURSES));
 */
const loginMiddlewareAdmin = (req, res, next) => {
  let { username, password } = req.headers;
  let adminId = -1;

  if (ADMINS.length > 0)
    adminId = ADMINS.findIndex((admin) => admin.username === username);

  if (adminId === -1) {
    return res.status(409).send("User doesn't exist");
  } else if (
    ADMINS[adminId].username === username &&
    ADMINS[adminId].password === password
  ) {
    next();
  } else {
    return res.status(403).send("User Id or Password is incorrect");
  }
};

const loginMiddlewareUser = (req, res, next) => {
  let { username, password } = req.headers;
  let userId = -1;

  if (USERS.length > 0)
    userId = USERS.findIndex((user) => user.username === username);

  if (userId === -1) {
    return res.status(409).send("User doesn't exist");
  } else if (
    USERS[userId].username === username &&
    USERS[userId].password === password
  ) {
    next();
  } else {
    return res.status(403).send("User Id or Password is incorrect");
  }
};

/* const isAdmin = (req, res, next) => {
  if (
    ADMINS.findIndex((admin) => admin.username === req.headers.username) != -1
  ) {
    next();
  } else {
    return res.status(403).send("You are not an admin");
  }
}; */
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let { username, password } = req.body;

  if (ADMINS.findIndex((admin) => admin.username === username) != -1) {
    return res.status(409).send("User id already exists");
  }

  ADMINS.push({ username: username, password: password });
  //writeData("ADMINS.txt", ADMINS);
  return res.status(200).json({ message: "Admin created successfully" });
});

app.post("/admin/login", loginMiddlewareAdmin, (req, res) => {
  // logic to log in admin
  return res.status(200).json({ message: "Admin Logged in successfully" });
});

app.post("/admin/courses", loginMiddlewareAdmin, (req, res) => {
  // logic to create a course
  //Body: { title: 'course title', description: 'course description',
  //price: 100, imageLink: 'https://linktoimage.com', published: true }

  let course = req.body;
  if (course) {
    course.courseId = COURSES.length + 1;
    COURSES.push(course);
    //writeData("COURSES.txt", COURSES);
  }

  res.status(200).json({
    message: "Course created successfully",
    courseId: course.courseId,
  });
});

app.put("/admin/courses/:courseId", loginMiddlewareAdmin, (req, res) => {
  //Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink:
  //'https://updatedlinktoimage.com', published: false }
  //Output: { message: 'Course updated successfully' }
  // logic to edit a course

  let course = req.body;
  let courseId = req.params.courseId;
  //console.log("course " + JSON.stringify(course) + " course id " + courseId);
  let courseIndex = COURSES.findIndex((course) => course.courseId == courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  Object.assign(COURSES[courseIndex], course);
  /* COURSES[courseIndex].title = course.title;
  COURSES[courseIndex].description = course.description;
  COURSES[courseIndex].price = course.price;
  COURSES[courseIndex].imageLink = course.imageLink;
  COURSES[courseIndex].published = course.published; */

  return res.status(200).json({ message: "Course updated successfully" });
});

app.get("/admin/courses", loginMiddlewareAdmin, (req, res) => {
  // logic to get all courses
  /*   console.log("Admins " + JSON.stringify(ADMINS));
  console.log("Users " + JSON.stringify(USERS));
  console.log("Courses " + JSON.stringify(COURSES)); */
  return res.status(200).json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user

  let { username, password } = req.body;

  if (USERS.findIndex((user) => user.username === username) != -1) {
    return res.status(409).json({ message: "User id already exists" });
  }

  USERS.push({ username: username, password: password, purchasedCourses: [] });
  //writeData("USERS.txt", USERS);
  return res.status(200).json({ message: "User created successfully" });
});

app.post("/users/login", loginMiddlewareUser, (req, res) => {
  // logic to log in user
  return res.status(200).json({ message: "User Logged in successfully" });
});

app.get("/users/courses", loginMiddlewareUser, (req, res) => {
  // logic to list all courses
  return res.status(200).json(COURSES.filter((course) => course.published));
});

app.post("/users/courses/:courseId", loginMiddlewareUser, (req, res) => {
  // logic to purchase a course
  //let course = req.body;
  let courseId = req.params.courseId;

  let courseIndex = COURSES.findIndex((course) => course.courseId == courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  let userIndex = USERS.findIndex(
    (user) => user.username === req.headers["username"]
  );

  USERS[userIndex].purchasedCourses.push(COURSES[courseIndex].courseId);
  //console.log("USERS " + JSON.stringify(USERS[userIndex]));
  //writeData("USERS.txt", USERS);
  return res.status(200).json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", loginMiddlewareUser, (req, res) => {
  // logic to view purchased courses
  return res
    .status(200)
    .json(
      USERS[
        USERS.findIndex((user) => user.username === req.headers["username"])
      ].purchasedCourses.map((courseId) =>
        COURSES.find((course) => course.courseId === courseId)
      )
    );
});

app.listen(3000, () => {
  console.log("Server is listening on port: 3000");
});
