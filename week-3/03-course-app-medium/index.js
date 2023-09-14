const express = require('express');
const app = express();
const fs = require("fs/promises");
const path = require('path');
const jwt = require('jsonwebtoken');
const { executionAsyncId } = require('async_hooks');
const { read } = require('fs');


//File path variables
const adminFilePath = path.join(__dirname,"admins.json");
const userFilePath = path.join(__dirname, "users.json");
const coursesFilePath = path.join(__dirname, "courses.json");
const purchasesFilePath = path.join(__dirname, "purchases.json");

//Read and write functions
async function readAdminFile() {
  const data = await fs.readFile(adminFilePath,'utf-8');
  return JSON.parse(data);
}
async function writeFile(filepath,data) {
  fs.writeFile(filepath,JSON.stringify(data));
}
app.use(express.static(__dirname));
app.use(express.json());



// Admin routes
app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,"index.html"));
})

app.get("/admin/signup",(req,res) => {
  res.sendFile(path.join(__dirname,"adminsignup.html"));
})

app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  try {
    const adminfiledata = await readAdminFile();
    
    const signin = req.body;

    signin.id = adminfiledata.length + 1; // Fix the length calculation
    adminfiledata.push(signin);
    await writeFile(adminFilePath, adminfiledata); // Use the writeFile function
    res.status(201).json(adminfiledata); // Send a response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

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

app.get('*', (req, res) => {
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
