const express = require('express');
const fs = require('node:fs');

const app = express();

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// Authentication
const adminAuthentication = (req, res, next) => {
  next();
}
const userAuthentication = (req, res, next) => {
  next();
}

const getFileData = (fileName, callback) => {
  fs.readFile(fileName, 'utf-8', (err, fileData) => {
    if(err) {
      console.error(err);
      callback([]);
    } else {
      try {
        const data = JSON.parse(fileData);
        callback(data);
      } catch(err) {
        console.error("Error parsing file data:", err);
        callback([]);
      }
    }
  });
};

const writeFile = (fileName, data, callback) => {
  fs.writeFile(fileName, JSON.stringify(data), (err) => {
    if(err) {
      console.error("Error writing to file:", err);
      callback(err);
    }
    if(callback) {
      callback();
    }
  });
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  getFileData('admins.json', (admins) => {
    const adminExists = admins.find(a => a.username === admin.username);
    if(adminExists) {
      res.send(403).json({ message: "Admin already exists" });
    } else {
      admins.push(admin);
      writeFile('admins.json', admins, (err) => {
        if(err) {
          return res.status(500);
        }
        res.json("")
      })
    }
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
