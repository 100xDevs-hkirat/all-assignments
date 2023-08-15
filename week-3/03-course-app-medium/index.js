const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const { v4: uuid } = require('uuid');
const fs = require('fs');
const PORT = 3000;
const jwt = require('jsonwebtoken');
const jwtSecret = 'dev-jwt-secret';

app.use(bodyParser.json());

let ADMINS = [];
let COURSES = [];
let USERS = [];

const COURSE_PROPS = [
  'title',
  'description',
  'price',
  'imageLink',
  'published',
];

const COURSE_RES_PROPS = [...COURSE_PROPS, 'id'];

// ADMIN middleware

function authenticateAdmin(req, res, next) {
  const { authorization } = req.headers;

  try {
    const decryptedJwt = jwt.verify(authorization, jwtSecret);
    req.username = decryptedJwt.username;
    next();
  } catch (e) {
    return res.status(401).send({ message: 'Token expired' });
  }
}

// USER middleware

function authenticateUser(req, res, next) {
  const { authorization } = req.headers;

  try {
    const decryptedJwt = jwt.verify(authorization, jwtSecret);
    req.username = decryptedJwt.username;
    next();
  } catch (e) {
    return res.status(401).send({ message: 'Token expired' });
  }
}

// admins store
fs.readFile(
  path.join(__dirname, '/store/admins.json'),
  'utf-8',
  (err, data) => {
    function initiateAdminStore() {
      fs.writeFile(
        path.join(__dirname, '/store/admins.json'),
        JSON.stringify([]),
        (err) => {
          if (err) {
            console.log('Error in writing to file');
          } else {
            console.log('Store Created');
          }
        }
      );
    }

    if (err) {
      initiateAdminStore();
      return;
    }

    try {
      const adminsFromFile = JSON.parse(data);
      ADMINS = adminsFromFile;
    } catch (e) {
      initiateAdminStore();
      ADMINS = [];
    }
  }
);

// courses store setup
fs.readFile(
  path.join(__dirname, '/store/courses.json'),
  'utf-8',
  (err, data) => {
    function initiateCoursesStore() {
      fs.writeFile(
        path.join(__dirname, '/store/courses.json'),
        JSON.stringify([]),
        (err) => {
          if (err) {
            console.log('Error in writing to file');
          } else {
            console.log('Store Created');
          }
        }
      );
    }

    if (err) {
      initiateCoursesStore();
      return;
    }

    try {
      const coursesFromFile = JSON.parse(data);
      COURSES = coursesFromFile;
    } catch (e) {
      initiateCoursesStore();
      COURSES = [];
    }
  }
);

// users store
fs.readFile(path.join(__dirname, '/store/users.json'), 'utf-8', (err, data) => {
  function initiateUsersStore() {
    fs.writeFile(
      path.join(__dirname, '/store/users.json'),
      JSON.stringify([]),
      (err) => {
        if (err) {
          console.log('Error in writing to file');
        } else {
          console.log('Store Created');
        }
      }
    );
  }

  if (err) {
    initiateUsersStore();
    return;
  }

  try {
    const usersFromFile = JSON.parse(data);
    USERS = usersFromFile;
  } catch (e) {
    initiateUsersStore();
    USERS = [];
  }
});

function updateAdminStore() {
  fs.writeFile(
    path.join(__dirname, '/store/admins.json'),
    JSON.stringify(ADMINS),
    (err) => {
      if (err) {
        console.log('ADMIN store update failed');
        return;
      }
      console.log('ADMIN Store updated');
    }
  );
}

function updateCoursesStore() {
  fs.writeFile(
    path.join(__dirname, '/store/courses.json'),
    JSON.stringify(COURSES),
    (err) => {
      if (err) {
        console.log('COURSES store update failed');
        return;
      }
      console.log('COURSES Store updated');
    }
  );
}

function updateUsersStore() {
  fs.writeFile(
    path.join(__dirname, '/store/users.json'),
    JSON.stringify(USERS),
    (err) => {
      if (err) {
        console.log('USERS store update failed');
        return;
      }
      console.log('USERS Store updated');
    }
  );
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const admin = ADMINS.find((a) => a.username === username);

  if (admin) {
    return res.status(409).send({ message: 'User exists' });
  }

  ADMINS.push({
    id: uuid(),
    username,
    password,
  });

  // payload should be object when expiresIn is used
  const token = jwt.sign({ username }, jwtSecret, {
    expiresIn: '1h', // expires in 1hour
  });

  updateAdminStore();

  res.status(200).send({ message: 'Admin created successfully', token });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const adminFromDb = ADMINS.find((a) => a.username === username);

  if (adminFromDb?.password !== password) {
    return res.status(401).send({ message: 'Invalid Credentials' });
  }

  // payload should be object when expiresIn is used
  const token = jwt.sign({ username }, jwtSecret, {
    expiresIn: '1h', // expires in 1hour
  });

  res.send({ message: 'Logged in successfully', token });
});

app.post('/admin/courses', authenticateAdmin, (req, res) => {
  const { title, description, price, imageLink, published } = req.body;
  const { username } = req;

  if (COURSE_PROPS.some((prop) => req.body[prop] === undefined)) {
    return res.status(401).send({ message: 'All properties are required' });
  }

  const adminUser = ADMINS.find((a) => a.username === username);

  const courseId = uuid();

  const newCourse = {
    title,
    description,
    price,
    imageLink,
    published,
    id: courseId,
    instructorId: adminUser.id,
  };

  COURSES.push(newCourse);

  if (!adminUser.courses) {
    adminUser.courses = [courseId];
  } else {
    adminUser.courses.push(courseId);
  }

  // update stores
  updateAdminStore();
  updateCoursesStore();

  res.send({ message: 'Course created successfully', courseId });
});

app.put('/admin/courses/:courseId', authenticateAdmin, (req, res) => {
  const { courseId } = req.params;

  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return res.status(401).send({ message: 'Course not found' });
  }

  const body = req.body;

  if (COURSE_PROPS.every((prop) => body[prop] === undefined)) {
    return res.status(400).send({ message: 'Atleast one field required' });
  }

  const newCourse = { ...course };

  COURSE_PROPS.forEach((prop) => {
    if (body[prop] !== undefined) {
      newCourse[prop] = body[prop];
    }
  });

  const updatedCourses = COURSES.map((c) => {
    if (c.id === courseId) {
      return newCourse;
    }
    return c;
  });

  COURSES = updatedCourses;

  updateCoursesStore();

  res.send({ message: 'Course updated successfully' });
});

app.get('/admin/courses', authenticateAdmin, (req, res) => {
  const { username } = req;

  const admin = ADMINS.find((u) => u.username === username);

  if (!admin) {
    return res
      .status(404)
      .send({ message: 'USER not found (no chance for this error)' });
  }

  const coursesByAdmin = COURSES.filter((c) => c.instructorId === admin.id);

  return res.send({ courses: coursesByAdmin });
});

// <-------------------- Admin DEV Route -------------------->
app.get('/admins', (req, res) => {
  const { 'dev-mode': devMode } = req.headers;

  if (!devMode) {
    return res.send(401);
  }

  res.send(ADMINS);
});

// <-------------------- User routes -------------------->
app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const user = USERS.find((a) => a.username === username);

  if (user) {
    return res.status(409).send({ message: 'User exists' });
  }

  USERS.push({
    id: uuid(),
    username,
    password,
  });

  // generate token
  const token = jwt.sign({ username }, jwtSecret, {
    expiresIn: '1h',
  });

  updateUsersStore();

  res.status(200).send({ message: 'User created successfully', token });
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const userFromDb = USERS.find((u) => u.username === username);

  if (userFromDb?.password !== password) {
    return res.status(401).send({ message: 'Invalid Credentials' });
  }

  // generate token
  const token = jwt.sign({ username }, jwtSecret, {
    expiresIn: '1h',
  });

  res.send({ message: 'Logged in successfully', token });
});

app.get('/users/courses', authenticateUser, (req, res) => {
  const publishedCourses = COURSES.filter((c) => c.published);

  const coursesResponse = publishedCourses.map((c) => {
    return COURSE_RES_PROPS.reduce((acc, prop) => {
      acc[prop] = c[prop];
      return acc;
    }, {});
  });

  res.send({ courses: coursesResponse });
});

app.post('/users/courses/:courseId', authenticateUser, (req, res) => {
  const { courseId } = req.params;

  // allow only published courses to purchase
  const course = COURSES.filter((c) => c.published).find(
    (c) => c.id === courseId
  );

  if (!course) {
    return res.status(401).send({ message: 'Course not found' });
  }

  const { username } = req;

  const currentUser = USERS.find((u) => u.username === username);

  if (
    currentUser?.purchasedCourses &&
    currentUser.purchasedCourses.includes(courseId)
  ) {
    // conflict status code
    return res.status(409).send({ message: 'Course purchased already' });
  }

  if (!currentUser?.purchasedCourses) {
    currentUser.purchasedCourses = [courseId];
  } else {
    currentUser.purchasedCourses.push(courseId);
  }

  updateUsersStore();

  res.send({ message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', authenticateUser, (req, res) => {
  const { username } = req;

  const currentUser = USERS.find((u) => u.username === username);

  if (!currentUser) {
    return res.status(404).send({ message: 'USER not found (no chance)' });
  }

  const purchasedCourses = currentUser?.purchasedCourses || [];

  const courseDetails = COURSES.filter((c) => purchasedCourses.includes(c.id));

  const coursesResponse = courseDetails.map((c) => {
    return COURSE_RES_PROPS.reduce((acc, prop) => {
      acc[prop] = c[prop];
      return acc;
    }, {});
  });

  res.send({ courses: coursesResponse });
});

// <-------------------- USER DEV Route -------------------->
app.get('/users', (req, res) => {
  const { 'dev-mode': devMode } = req.headers;

  if (!devMode) {
    return res.send(401);
  }

  res.send(USERS);
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});
