const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Helper Function
function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const isAdmin = (username, password) => {
  const flag = ADMINS.find(admin => admin.username === username);
  if(flag == undefined) {
    return 0;
  }
  if(flag.password === password) {
    return {...flag, pass: true}
  }
  return {...flag, pass: false};
}

const isUser = (username, password) => {
  const flag = USERS.find(user => user.username === username);
  if(flag == undefined) {
    return 0;
  }
  if(flag.password === password) {
    return {...flag, pass: true}
  }
  return {...flag, pass: false};
}

const editCourse = (courseId, body) => {
  for(let i in COURSES) {
    if(COURSES[i].courseId === courseId) {
      if(body.title != '' || body.title != undefined) {
        COURSES[i].title = body.title;
      }
      if(body.description != '' || body.description != undefined) {
        COURSES[i].description = body.description;
      }
      if(body.price != '' || body.price != undefined) {
        COURSES[i].price = body.price;
      }
      if(body.imageLink != '' || body.imageLink != undefined) {
        COURSES[i].imageLink = body.imageLink;
      }
      if(body.published != '' || body.published != undefined) {
        COURSES[i].published = body.published;
      }
      return 1;
    }
  }
  return 0;
}

const purchaseCourse = (courseId, userId) => {
  const course = COURSES.find(course => course.courseId == courseId);
  if(course == undefined) {
    return 0;
  }
  const user = USERS.find(user => user.id == userId);
  course.purchaser.push(user);
  user.purchasedCourses.push(course);
  return 1;
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == '') {
    return res.status(400).json({message: "Bad fetch request"});
  }
  const id = generateRandomId(10);
  const courses = [];
  const admin = {username, password, id, courses};
  const isAdmin = ADMINS.find(a => a.username == username);
  if(isAdmin != undefined) {
    return res.status(400).json({message: "Username already exixts :("});
  }
  ADMINS.push(admin);
  return res.status(200).json({
    message: 'Admin created successfully'
  });
});


app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({
      message: "User not found :("
    });
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const {username, password} = req.headers;
  const {title, description, price, imageLink, published} = req.body;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({
      message: "Only Admin can create a course :("
    });
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  const courseId = generateRandomId(Math.floor(Math.random() * 20) + 1);
  const purchaser = [];
  const course = {title, description, price, imageLink, published, courseId, creator: is.id, purchaser};
  COURSES.push(course);
  for(let i in ADMINS) {
    if(ADMINS[i].username == username) {
      ADMINS[i].courses.push(course);
      break;
    }
  }
  return res.status(200).json({
    message: 'Course created successfully',
    courseId
  });
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const {courseId} = req.params;
  const {username, password} = req.headers;
  const body = req.body;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({message: "Only Admins can edit course :)"});
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  const state = editCourse(courseId, body);
  if(!state) {
    return res.status(404).json({message: "Invalid params!"});
  }
  return res.status(200).json({ message: 'Course updated successfully' });
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const {username, password} = req.headers;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({message: "Only Admins can see courses :)"});
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == '') {
    return res.status(400).json({message: "Bad fetch request"});
  }
  const id = generateRandomId(10);
  const purchasedCourses = [];
  const user = {username, password, id, purchasedCourses};
  const isUser = USERS.find(a => a.username == username);
  if(isUser != undefined) {
    return res.status(400).json({message: "Username already exixts :("});
  }
  USERS.push(user);
  return res.status(200).json({
    message: 'User created successfully'
  });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const is = isUser(username, password);
  if(is == 0) {
    return res.status(404).json({
      message: "User not found :("
    });
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({ message: 'Logged in successfully' });
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const {username, password} = req.headers;
  const is = isUser(username, password);
  if(is == 0) {
    return res.status(404).json({message: "Login to see Courses :)"});
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const {courseId} = req.params;
  const {username, password} = req.headers;
  const is = isUser(username, password);
  if(is == 0) {
    return res.status(404).json({message: "Login to see Courses :)"});
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  // Check if transaction is successfull;
  const isPurchase = purchaseCourse(courseId, is.id);
  if(isPurchase == 0) {
    return res.status(404).json({message: "Invalid Params!"});
  };
  return res.status(200).json({ message: 'Course purchased successfully' })
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const {username, password} = req.headers;
  const is = isUser(username, password);
  if(is == 0) {
    return res.status(404).json({message: "Login to see Courses :)"});
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({purchasedCourses: is.purchasedCourses})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
