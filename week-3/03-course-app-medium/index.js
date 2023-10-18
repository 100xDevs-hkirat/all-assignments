const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY_ADMIN = "Secret";
const JWT_SECRET_KEY_USER = "SecretUser"

app.use(express.json());

const generateTokenForAdmin = (user) => {
  const data = { username: user.adminname };
  return jwt.sign(data, JWT_SECRET_KEY_ADMIN, {expiresIn: '1h'});

}

const generateTokenForUser = (user) => {
  const data = {username: user.username};
  return jwt.sign(data, JWT_SECRET_KEY_USER, {expiresIn: '1h'});
}

const authenticateJwt = (req,res,next) => {
  const request = req.header("token");
  if(request) {
    const token = request.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY_ADMIN, (err,user) => {
      if(err)
        res.status(403).send("Got Authentication Error");
      next();
    })
  }
  else {
    res.status(401).send("Provide JWT token");
  }
}

const authenticateJwtUser = (req, res, next) => {
  const request = req.header("token");
  if(request) {
    const token = request.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY_USER, (err,user) => {
      if(err) {
        res.status(403).send("Got Authentication Error");
      } else {
        req.user = user;
        next();
      }
    })
  }
  else {
    res.status(401).send("Provide JWT token");
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const pass = req.body.pass;
  const admin = {
    adminname:username,
    pass:pass
  }

  fs.readFile("admin.json", "utf8", (err, data) => {
    if(err)
      throw err;
    else {
      let existingAdmins = JSON.parse(data);
      const existingAdmin = existingAdmins.findIndex(a => a.adminname === admin.username);
      if (existingAdmin !== -1) {
        res.status(403).json({ message: 'Admin already exists' });
      }
      else {
        let admins = JSON.parse(data);
        admins.push(admin);
        const token = generateTokenForAdmin(admin);
        fs.writeFile("admin.json", JSON.stringify(admins), (err) => {
          if(err)
            throw err;  
          res.status(201).json({message: "Admin created successfully", token});
        })
      }
    }
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const username = req.header("username");
  const pass = req.header("pass");
  fs.readFile("admin.json", "utf8", (err, data) => {
    if(err)
      throw err;
    else {
      let admins = JSON.parse(data);
      let admin = null;
      for(let i=0;i<admins.length;i++) {
        if(admins[i].adminname===username && admins[i].pass===parseInt(pass)) {
          admin=admins[i];
          break;
        }
      }
      if(admin) {
        const token = generateTokenForAdmin(admin);
        res.status(200).json({message: "Logged in successfully", token});
      }
      else {
        res.status(404).send("Admin Not Found");
      }
    }
  })
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  fs.readFile("course.json", "utf8", (err,data) => {
    if(err)
      res.json({message: "Error in opening File"});
    let courses = JSON.parse(data);
    course.id = courses.length+1;
    const existingcourse = courses.find(a => a.title === course.title);
    if(existingcourse)
      res.status(403).json({ message: 'Course already exists' });
    else {
      courses.push(course);
      fs.writeFile("course.json", JSON.stringify(courses), (err) => {
        if(err) {
          throw err;
        }
        else {
          res.status(200).json({message: "Course created successfully", courseId: course.id});
        }
      })
    }
  })
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const id = req.params.courseId;
  const newCourse = req.body;
  fs.readFile("course.json", "utf8", (err,data) => {
    if(err)
      throw err;
    else {
      const courses = JSON.parse(data);
      const courseExist = courses.findIndex(a => a.id === parseInt(id));
      if(courseExist === -1) {
        res.status(404).json({message: "Course Not Found"});
      } else {
        Object.assign(courses[courseExist], req.body);
        fs.writeFile("course.json", JSON.stringify(courses), (err) => {
          if(err)
            throw err;
          res.status(200).json({message: "Updated Successfully", newCourse});
        })
      }
    }
  })
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  fs.readFile("course.json", "utf8", (err,data) => {
    if(err)
      throw err;
    else {
      const courses = JSON.parse(data);
      res.status(200).json({courses: courses});
    }
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const username = req.body.username;
  const pass = req.body.pass;
  fs.readFile("user.json", "utf8", (err,data) => {
    if(err)
      throw err;
    else {
      const newUser = {
        username: username,
        pass: pass
      }
      const users = JSON.parse(data);
      users.push(newUser);
      const token = generateTokenForUser(newUser);
      fs.writeFile("user.json", JSON.stringify(users), (err) => {
        if(err)
          throw err;
        else {
          res.status(201).json({message: "User created successfully", token});
        }
      })
    }
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const username = req.header("username");
  const pass = req.header("pass");
  fs.readFile("user.json", "utf8", (err,data) => {
    if(err)
      throw err;
    else {
      const users = JSON.parse(data);
      const user = users.find(a => a.username === username && a.pass === parseInt(pass));
      if(user) {
        const token = generateTokenForUser(user.username);
        res.status(200).json( { message: "Logged in Successfully", token});
      }
      res.status(404).send("User Not Found");
    }
  })
});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  // logic to list all courses
  fs.readFile("course.json", "utf8", (err,data) => {
    if(err) {
      throw err;
    }
    const courses = JSON.parse(data);
    let allPublishedCourses = []; 
    for(let i=0;i<courses.length;i++) {
      if(courses[i].published)
        allPublishedCourses.push(courses[i]);
    }
    res.status(200).json({courses: allPublishedCourses});
  })
});

app.post('/users/courses/:courseId', authenticateJwtUser, (req, res) => {
  // logic to purchase a course
  fs.readFile("course.json", "utf8", (err,data) => {
    if(err)
      throw err;
    const courses = JSON.parse(data);
    const course = courses.find(c => c.id === parseInt(req.params.courseId));
    if (course) {
      fs.readFile("user.json", "utf8", (err, data1) => {
        const users = JSON.parse(data1);
        console.log(req.username);
        const user = users.find(u => u.username === req.user.username);
        if (user) 
        {
          if (!user.purchasedCourses) {
            user.purchasedCourses = [];
          }
          user.purchasedCourses.push(course);
          fs.writeFile("user.json", JSON.stringify(users), (err) => {
            if(err)
              throw err;
            res.json({message: "Updated successfully"});
          });
          res.json({ message: 'Course purchased successfully' });
        } 
        else {
          res.status(403).json({ message: 'User not found' });
        }  
      }) 
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  })
});

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
  // logic to view purchased courses
  fs.readFile("user.json", "utf8", (err,data) => {
    const users = JSON.parse(data);
    const user = users.find(u => u.username === req.user.username);
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses});
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
