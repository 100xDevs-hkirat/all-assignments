const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let USERS = [];

const adminSecret = "SecRTE!@#&^%";
const userSecret = "USRSECRTTHG#@^";

const adminAuthentication = (req,res,next) => {
  const admin = req.headers.authorization;

  if (admin) {
    const token = admin.split(' ')[1];

    jwt.verify(token, adminSecret, (err, data) => {
      if(err) {
        return res.sendStatus(403);
      }

      next();
    })
  } else {
    return res.status(401).json({message: "Admin authentication failed"});
  }
}

const userAuthentication = (req,res,next) => {
  const user = req.headers.authorization;

  if(user) {
    const token = user.split(' ')[1];
    jwt.verify(token, userSecret, (err, data) => {
      if (err) return res.sendStatus(403);

      req.user = data;
      next();
    })
  } else {
    return res.sendStatus(401);
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;

  fs.readFile(path.join(__dirname, 'admins.json'), (err, data) => {
    if(err) {
      res.status(404).json({message: "Unable to read file"});
    }

    const ADMIN = JSON.parse(data);
    const exists = ADMIN.find(e => e.username === admin.username);
    if (exists) {
      res.status(403).json({message: "Admin already exists"});
    } else {
      ADMIN.push(admin);
      fs.writeFile(path.join(__dirname, "admins.json"), JSON.stringify(ADMIN), (err) => {
        if (err) throw err;

        res.json({message: "Admin created successfully"});
      })
    }
  })
});

app.post('/admin/login', (req, res) => {
  const admin = req.headers;
  fs.readFile(path.join(__dirname, "admins.json"), (err, data) => {
    if (err) throw err;

    const ADMINS = JSON.parse(data);
    const verify = ADMINS.find(e => e.username === admin.username && e.password === admin.password);
    if(verify) {
      const payload = { username: req.headers.username };
      const token = jwt.sign(payload, adminSecret, { expiresIn: '1h'});
      res.json({message: "Admin authenticated successfully", token: token});
    } else {
      return res.status(401).json({message: "Admin authentication failed"});
    }
  })
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // insert courses to courses json
  const course = req.body;
  
  fs.readFile(path.join(__dirname, "courses.json"), (err, data) =>{
    if (err) {
      res.status(500).json({message: "Unable to read Courses"});
    }

    const COURSES = JSON.parse(data);
    Object.assign(course, {CourseId: COURSES.length + 1});
    const exists = COURSES.find(e => e.title === course.title);
    if (exists) {
      res.status(403).json({message: "Course title already exists"});
    } else {
      COURSES.push(course);
      fs.writeFile(path.join(__dirname, "courses.json"), JSON.stringify(COURSES), (err) => {
        if (err) throw err;

        res.json({message: "Course added successfully"});
      })
    }
  })
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const update = req.body;
  Object.assign(update, { CourseId: parseInt(req.params.courseId) });

  fs.readFile(path.join(__dirname, "courses.json"), (err, data) => {
    if (err) {
      res.status(500).json({message: "Unable to read Courses"});
    }

    const COURSES = JSON.parse(data);
    const course = COURSES.find(e => e.CourseId === update.CourseId);
    if(course) {
      Object.assign(course, update);

      fs.writeFile(path.join(__dirname, "courses.json"), JSON.stringify(COURSES), (err) => {
        if (err) throw err;

        res.json({message: "Course updated scueesssfully"});
      })
    } else {
      res.sendStatus(403);
    }
  })
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  fs.readFile(path.join(__dirname, "courses.json"), (err, data) => {
    if (err) {
      res.status(500).json({message: "Unable to read Courses"});
    }

    const COURSES = JSON.parse(data);
    res.json({courses: COURSES});
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = Object.assign(req.body, { purchasedCourses: []});

  fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
    if (err) {
      res.status(500).json({message: "Unable to read Users file"});
    }

    const USERS = JSON.parse(data);

    const exists = USERS.find(e => e.username === user.username);
    if (exists) {
      res.status(403).json({message: "User already exists"});
    } else {
      USERS.push(user);
      fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(USERS), (err) => {
        if (err) throw err;

        res.json({message: "User added successfully"});
      })
    }
  })
});

app.post('/users/login', (req, res) => {
  const user = req.headers;

  fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
    if (err) throw err;

    const USERS = JSON.parse(data);
    const exists = USERS.find(e => e.username === user.username && e.password === user.password);
    if(exists) {
      const payload = {username: user.username};
      const token = jwt.sign(payload, userSecret, {expiresIn: '1h'});
      res.json({message: "User signed in successfully", token: token});
    } else {
      res.status(401).json({message: "User does not exist"});
    }
  })
});

app.get('/users/courses', userAuthentication, (req, res) => {
  fs.readFile(path.join(__dirname, "courses.json"), (err, data) => {
    if (err) throw err;

    const COURSES = JSON.parse(data);
    res.json({courses: COURSES.filter(e => e.published)});
  })
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const username = req.user.username;
  const courseId = parseInt(req.params.courseId);

  fs.readFile(path.join(__dirname, "courses.json"), (err, data) => {
    if (err) throw err;

    const COURSES = JSON.parse(data);
    const exists = COURSES.find(e => e.CourseId === courseId && e.published);
    if(exists) {
      fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
        if (err) throw err;

        const USERS = JSON.parse(data);
        const user = USERS.find(e => e.username === username);
        if(user) {
          Object.assign(user, { purchasedCourses: [courseId]});

          fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(USERS), (err) => {
            if (err) throw err;

            res.json({message: "Course purchased successfully"});
          })
        }
      })
    } else {
      res.status(404).json({message: "COurse not found or not available"});
    }
  })
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  const username = req.user.username;
  
  fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
    if (err) throw err;

    const USERS = JSON.parse(data);
    const user = USERS.find(e => e.username === username);
    if(user) {
      fs.readFile(path.join(__dirname, "Courses.json"), (err, data) => {
        if(err) throw err;

        const COURSES = JSON.parse(data);
        res.json({courses: COURSES.filter(e => user.purchasedCourses.includes(e.CourseId))});
      })
    }
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
