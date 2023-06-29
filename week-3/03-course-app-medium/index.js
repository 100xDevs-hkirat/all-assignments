const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');
app.use(express.json());
app.use(bodyParser.json());


function authenticate(arr, req) {
  const username = req.headers['username'];
  const password = req.headers['password'];
  return arr.filter(admin => admin.username === username && admin.password === password).length != 0;
}

function doesUsernameExist(arr, req) {
  return arr.filter(element => element.username === req.body.username);
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  fs.readFile('./files/admin.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const ADMINS = JSON.parse(data);
    const usernameExist = doesUsernameExist(ADMINS, req);
    if (usernameExist.length != 0) {
      return res.status(404).send("username already  exist in our database, please try again with some other username");
    }
    ADMINS.push({
      'username': req.body.username,
      'password': req.body.password
    })
    fs.writeFileSync('./files/admin.txt', JSON.stringify(ADMINS));
    res.status(200).send({ message: 'Admin created successfully' });
  })

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  fs.readFile('./files/admin.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const ADMINS = JSON.parse(data);
    if (!authenticate(ADMINS, req)) {
      return res.status(404).send();
    }

    return res.status(200).send({ message: 'Logged in successfully' });
  })

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  fs.readFile('./files/admin.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const ADMINS = JSON.parse(data);
    if (!authenticate(ADMINS, req)) {
      return res.status(404).send('Please enter correct admin username and password to add a new course');
    }
    const coursesData = fs.readFileSync('./files/course.txt', 'utf-8');
    const COURSES = JSON.parse(coursesData);
    const course = {
      "title": req.body.title,
      "description": req.body.description,
      "price": parseInt(req.body.price),
      "imageLink": req.body.imageLink,
      "published": req.body.published,
      "id": COURSES.length + 1
    };
    COURSES.push(course);
    fs.writeFileSync('./files/course.txt', JSON.stringify(COURSES));
    res.status(200).send({ message: 'Course created successfully', courseId: course.id });
  })

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  // Assuming this code is inside a request handler function
  fs.readFile('./files/admin.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const ADMINS = JSON.parse(data);
    if (!authenticate(ADMINS, req)) {
      return res.status(404).send('Please enter correct admin username and password to update the course');
    }
    const COURSES = JSON.parse(fs.readFileSync('./files/course.txt', 'utf-8'));
    const courseId = parseInt(req.params.courseId);
    const reqBody = req.body;
    // Find the course with matching courseId and update its details
    const course = COURSES.find(course => course.id === courseId);
    if (course) {
      course.title = reqBody.title;
      course.description = reqBody.description;
      course.price = reqBody.price;
      course.imageLink = reqBody.imageLink;
      course.published = reqBody.published;
      fs.writeFileSync('./files/course.txt', JSON.stringify(COURSES));
      res.status(200).send({ message: 'Course updated successfully' });
    } else {
      res.status(404).send({ message: 'Course not found' });
    }

  })

});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  fs.readFile('./files/admin.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const ADMINS = JSON.parse(data);
    const usernameExist = doesUsernameExist(ADMINS, req);
    if (!authenticate(ADMINS, req)) {
      return res.status(404).send('Please enter correct admin username and password to get all the courses list');
    }
    const COURSES = fs.readFileSync('./files/course.txt', 'utf-8');
    return res.send(COURSES);
  })

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  fs.readFile('./files/users.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const USERS = JSON.parse(data);
    const usernameExist = doesUsernameExist(USERS, req);
    if (usernameExist.length != 0) {
      return res.status(404).send("username already  exist in our database, please try again with some other username");
    }
    USERS.push({
      'username': req.body.username,
      'password': req.body.password
    })
    fs.writeFileSync('./files/users.txt', JSON.stringify(USERS));
    res.status(200).send({ message: 'User created successfully' });
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  fs.readFile('./files/users.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const USERS = JSON.parse(data);
    if (!authenticate(USERS, req)) {
      return res.status(404).send();
    }

    return res.status(200).send({ message: 'Logged in successfully' });
  })

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  fs.readFile('./files/users.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const USERS = JSON.parse(data);
    if (!authenticate(USERS, req)) {
      return res.status(404).send('Please enter correct username and password to get all the courses list');
    }
    const COURSES = fs.readFileSync('./files/course.txt', 'utf-8');
    return res.send(COURSES);
  })
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  fs.readFile('./files/users.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const USERS = JSON.parse(data);
    if (!authenticate(USERS, req)) {
      return res.status(404).send('Please enter correct username and password to get all the courses list');
    }
    const COURSES = JSON.parse(fs.readFileSync('./files/course.txt', 'utf-8'));
    const courseId = parseInt(req.params.courseId);

    const course = COURSES.filter(course => course.id === courseId);
    if (course.length == 0) {
      return res.status(404).send('Please give correct course id');
    }
    else {
      let PURCHASED_COURSES = JSON.parse(fs.readFileSync('./files/coursePurchased.txt','utf-8'));
      PURCHASED_COURSES = PURCHASED_COURSES.concat(course);
      fs.writeFileSync('./files/coursePurchased.txt', JSON.stringify(PURCHASED_COURSES));
      res.status(200).send({ message: 'Course purchased successfully' });
    }
  })

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  fs.readFile('./files/users.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const USERS = JSON.parse(data);
    if (!authenticate(USERS, req)) {
      return res.status(404).send('Please enter correct username and password to purchase the course');
    }
    let PURCHASED_COURSES = JSON.parse(fs.readFileSync('./files/coursePurchased.txt','utf-8'));

    res.send({ purchasedCourses: PURCHASED_COURSES })
  });

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
