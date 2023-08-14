const express = require('express');
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const ADMINS_SECRET_KEY = "2003";
const USERS_SECRET_KEY = "2018";

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Helper functions

const isAdmin = (username, password) => {
  const flag = ADMINS.find(admin => admin.username === username);
  if (flag == undefined) {
    return 0;
  }
  if (flag.password === password) {
    return { ...flag, pass: true }
  }
  return { ...flag, pass: false };
}

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

const editCourse = (courseId, body) => {
  for (let i in COURSES) {
    if (COURSES[i].courseId === courseId) {
      if (body.title != '' || body.title != undefined) {
        COURSES[i].title = body.title;
      }
      if (body.description != '' || body.description != undefined) {
        COURSES[i].description = body.description;
      }
      if (body.price != '' || body.price != undefined) {
        COURSES[i].price = body.price;
      }
      if (body.imageLink != '' || body.imageLink != undefined) {
        COURSES[i].imageLink = body.imageLink;
      }
      if (body.published != '' || body.published != undefined) {
        COURSES[i].published = body.published;
      }
      return 1;
    }
  }
  return 0;
}

const purchaseCourse = (courseId, userId) => {
  const course = COURSES.find(course => course.courseId == courseId);
  if (course == undefined) {
    return 0;
  }
  const user = USERS.find(user => user.id == userId);
  course.purchaser.push({ userId });
  user.purchasedCourses.push({ course });
  return 1;
}

const isUser = (username, password) => {
  const flag = USERS.find(user => user.username === username);
  if (flag == undefined) {
    return 0;
  }
  if (flag.password === password) {
    return { ...flag, pass: true }
  }
  return { ...flag, pass: false };
}


// Middleware
const adminTokenAuth = (req, res, next) => {
  let { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json({ message: "Unauthorized :)" })
  }
  if(authorization.startsWith("Bearer")) {
    authorization = authorization.split(" ")[1];
  }
  const decoded = jwt.verify(authorization, ADMINS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidded :)" })
    }
    return decoded;
  });
  req.user = decoded;
  next();
}

const userTokenAuth = (req, res, next) => {
  let { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json({ message: "Unauthorized :)" })
  }
  if(authorization.startsWith("Bearer")) {
    authorization = authorization.split(" ")[1];
  }
  const decoded = jwt.verify(authorization, USERS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden :)" })
    }
    return decoded;
  });
  req.user = decoded;
  next();
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` });
    }
    ADMINS = JSON.parse(data);
    const { username, password } = req.body;
    if (!username || username == '' || !password || password == '') {
      return res.status(400).json({ message: "Bad fetch request" });
    }
    const id = generateRandomId(10);
    const token = jwt.sign({ username, id }, SECRET_KEY, { expiresIn: "1h" });
    const courses = [];
    const admin = { username, password, courses, id };
    const isAdmin = ADMINS.find(a => a.username == username);
    if (isAdmin != undefined) {
      return res.status(400).json({ message: "Username already exixts :(" });
    }
    ADMINS.push(admin);
    fs.writeFile("admins.json", JSON.stringify(ADMINS), (err) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error - ${err}` });
      }
    });

    return res.status(200).json({
      message: 'Admin created successfully',
      token
    });
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  fs.readFile("./admins.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` });
    }
    ADMINS = JSON.parse(data);
    const { username, password } = req.headers;
    const is = isAdmin(username, password);
    if (is == 0) {
      return res.status(404).json({
        message: "User not found :("
      });
    }
    if (is.pass == false) {
      return res.status(400).json({ message: 'Password error' });
    }
    const token = jwt.sign({ username, id: is.id }, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ message: 'Logged in successfully', token })
  })
});

app.post('/admin/courses', adminTokenAuth, (req, res) => {
  // logic to create a course
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` });
    }
    ADMINS = JSON.parse(data);
    const admin = req.user;
    const { title, description, price, imageLink, published } = req.body

    const courseId = generateRandomId(Math.floor(Math.random() * 20) + 1);
    const purchaser = [];
    const course = { title, description, price, imageLink, published, courseId, creator: admin.id, purchaser };
    fs.readFile("courses.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error - ${err}` });
      }
      COURSES = JSON.parse(data);

      COURSES.push(course);
      fs.writeFile("courses.json", JSON.stringify(COURSES), (err) => {
        if (err) {
          return res.status(500).json({ message: `Internal Server Error - ${err}` });
        }
      });
    })
    for (let i in ADMINS) {
      if (ADMINS[i].username == admin.username) {
        ADMINS[i].courses.push(courseId);
        break;
      }
    }
    fs.writeFile("admins.json", JSON.stringify(ADMINS), (err) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error - ${err}` });
      }
    });
    return res.status(200).json({
      message: 'Course created successfully',
      courseId
    });
  })
});

app.put('/admin/courses/:courseId', adminTokenAuth, (req, res) => {
  // logic to edit a course
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` })
    }
    COURSES = JSON.parse(data);
    const { courseId } = req.params;
    const admin = req.user;
    const body = req.body;
    const state = editCourse(courseId, body);
    if (!state) {
      return res.status(404).json({ message: "Invalid params!" });
    }
    fs.writeFile("courses.json", JSON.stringify(COURSES), (err) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error - ${err}` })
      }
    })
    return res.status(200).json({ message: 'Course updated successfully' });
  })
});

app.get('/admin/courses', adminTokenAuth, (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` })
    }
    COURSES = JSON.parse(data);
    return res.status(200).json({ courses: COURSES });
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` })
    }
    USERS = JSON.parse(data);
    const { username, password } = req.body;
    if (!username || username == '' || !password || password == '') {
      return res.status(400).json({ message: "Bad fetch request" });
    }
    const id = generateRandomId(10);
    const purchasedCourses = [];
    const user = { username, password, id, purchasedCourses };
    const isUser = USERS.find(a => a.username == username);
    if (isUser != undefined) {
      return res.status(400).json({ message: "Username already exixts :(" });
    }
    USERS.push(user);
    fs.writeFile("users.json", JSON.stringify(USERS), (err) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error - ${err}` })
      }
    })
    const token = jwt.sign({ username, id }, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({
      message: 'User created successfully',
      token
    });
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` })
    }
    USERS = JSON.parse(data);
    const { username, password } = req.headers;
    if (username == '' || username == undefined || password == '' || password == undefined) {
      return res.status(400).json({ message: "Bad fetch Request :(" });
    }
    const is = isUser(username, password);
    if (is == 0) {
      return res.status(404).json({ message: "User not found :)" });
    }
    if (is.pass == false) {
      return res.status(400).json({ message: "Wrong password :)" });
    }
    const token = jwt.sign({ username, id: is.id }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Logged in successfully', token });
  })
});

app.get('/users/courses', userTokenAuth, (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error - ${err}` })
    }
    COURSES = JSON.parse(data);
    const courses = COURSES.filter(course => course.published == true);
    return res.status(200).json({ courses });
  })
});

app.post('/users/courses/:courseId', userTokenAuth, (req, res) => {
  // logic to purchase a course
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
    COURSES = JSON.parse(data);
    const user = req.user;
    const { courseId } = req.params;
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error: ${err}` });
      }
      USERS = JSON.parse(data);
      // Check if transaction is successfull;
      const isPurchase = purchaseCourse(courseId, user.id);
      if (isPurchase == 0) {
        return res.status(404).json({ message: "Invalid Params!" });
      };
      fs.writeFile("courses.json", JSON.stringify(COURSES), (err) => {
        if (err) {
          return res.status(500).json({ message: `Internal Server Error: ${err}` });
        }
      });
      fs.writeFile("users.json", JSON.stringify(USERS), (err) => {
        if (err) {
          return res.status(500).json({ message: `Internal Server Error: ${err}` });
        }
      });
      return res.status(200).json({ message: 'Course purchased successfully' })
    });
  })
});

app.get('/users/purchasedCourses', userTokenAuth, (req, res) => {
  // logic to view purchased courses
  const user = req.user;
  fs.readFile("users.json", "utf-8", (err, data1) => {
    if (err) {
      return res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
    USERS = JSON.parse(data1);
    fs.readFile("courses.json", "utf-8", (err, data2) => {
      if (err) {
        return res.status(500).json({ message: `Internal Server Error: ${err}` });
      }
      COURSES = JSON.parse(data2);
      const data = USERS.find(use => use.id == user.id);
      const purchasedCourses = data.purchasedCourses
      return res.status(200).json({ purchasedCourses })
    })
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
