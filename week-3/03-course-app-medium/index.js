require('dotenv').config()
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());
app.use(bodyParser.json());
// let ADMINS = [];
// let USERS = [];
// let COURSES = [];
const generateJwtAdmin = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_ADMIN, {expiresIn : '1h'});
  return accessToken

}
const authenticateJwtAdmin = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN, (err, user) => {
    if(err) throw err;
    if(user){
      req.user = user
      next();
    }
    else{
      res.send("Unable to log in");
    }
  })

}


const generateJwtUser = (object) => {
  const accessToken = jwt.sign(object, process.env.ACCESS_TOKEN_SECRET_USER, {expiresIn : '1h'});
  return accessToken

}

const authenticateJwtUser = (req,res,next) => {

  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER, (err, user) => {
    if(err){
      console.log("There is an error")
      
    };
    if(user){
      req.user = user
      next();
      
    }
    else{
      res.send("Unable to log in");
    }
  })

}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
 const obj = req.body;
 

 fs.readFile("admins.json", "utf-8", (err,admins) => {
  if(err) throw err;
  let newData = JSON.parse(admins);

  const existingAdmin = newData.find((element) => element === obj);

  if(existingAdmin) {
    res.send({message: "Admin already exists"});
   }
  
  else{
    const accessToken = generateJwtAdmin(obj);
    // ADMINS.push(obj);
    // console.log(ADMINS);
    newData.push(obj);

    fs.writeFile("admins.json", JSON.stringify(newData), (err) => {
      if(err) throw err;
      res.send({
        message : "User Signed Successfully",
        accessToken,
      });
    })

  }






})




});


app.post('/admin/login', (req, res) => {
  // logic to log in admin
const {username, password} = req.headers;
  fs.readFile("admins.json", "utf-8", (err,admins) => {
    let newData = JSON.parse(admins);
    let user = newData.find((element) => element.username === username && element.password === password);
    if(user){
      const accessToken = generateJwtAdmin(user);
      res.send({message:"Admin Logged in successfully", accessToken});
    }
    else{
      res.status(404).send("invalid credentials");
    }  

  })

  

});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  console.log("HEEEEEELLLLOOOOO")
  var body = req.body;
  var {title, descriptipn, price, imageLink, published} = body;
  var id = Math.floor(Math.random() * 10000)


  var obj = {
    id,
    title,
    descriptipn, 
    price, 
    imageLink, 
    published
  }


  fs.readFile("courses.json", "utf-8", (err,data) => {
    if(err) throw err;
    let newData = JSON.parse(data);

    newData.push(obj);

    fs.writeFile("courses.json", JSON.stringify(newData), (err) => {
      if(err) throw err;
      res.send({
        message: "Course created Successfully",
        id
      })
    })



  })
  // COURSES.push(obj);
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  var body = req.body;

fs.readFile("courses.json", "utf-8", (err,courses) => {
  if(err) throw err
  let newData = JSON.parse(courses)
  var course = newData.find((element) => element.id === id);
  if(course){
    Object.assign(course,body);
    console.log("HEEEELLLOOOOO")
    fs.writeFile("courses.json", JSON.stringify(newData), "utf-8", (err) => {
      if(err) throw err;
      res.send("Course Updated Sucessfully");
    })
  }
  else{
    res.status(404).send("Course does not exist");
  }
})

});

app.get('/admin/courses',authenticateJwtAdmin, (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf-8", (err,course) => {
    let newData = JSON.parse(course);
    res.send(newData);
  })

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user

  const {username, password} =  req.body;
  fs.readFile("users.json", "utf-8", (err, users) => {
    let newData = JSON.parse(users);
    const user = newData.find((element) => element.username === username && element.password === password)
    if(user){
      res.send("User already exists");
    } 
  
    else{
    var obj = {
      username,
      password,
      purchasedCourses : []
    }

    newData.push(obj);
    fs.writeFile("users.json", JSON.stringify(newData), (err) => {
      if(err) throw err;
      accessToken = generateJwtUser({username, password});
      res.send({message : "User created successfully", accessToken})

    })

  }
  })

});

app.post('/users/login', (req, res) => {
  const {username, password} = req.headers;
  // logic to log in user
  fs.readFile("users.json", "utf-8", (err,users) => {
    let newData = JSON.parse(users);
    let user = newData.find((element) => element.username === username && element.password === password);
    if(user){
      const accessToken = generateJwtUser(user);
      res.send({message:"User Logged in successfully", accessToken});
    }
    else{
      res.status(404).send("invalid credentials");
    }  

  })


});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf-8", (err,course) => {
    if(err) throw err;
    let newData = JSON.parse(course);
    res.send(newData);
  })
});

app.post('/users/courses/:courseId',authenticateJwtUser, (req, res) => {
  // logic to purchase a course
  var id = parseInt(req.params.courseId);
  var username = req.user.username;
  fs.readFile("courses.json", "utf-8", (err, course) => {
    if(err) throw err;
    let newDataCourses = JSON.parse(course);
    fs.readFile("users.json", "utf-8", (err, users) => {
      if(err) throw err;
      let newDataUser = JSON.parse(users);
      var user = newDataUser.find((element) => element.username === username)
      var course = newDataCourses.find((element) => element.id === id);
    if(course){
      user['purchasedCourses'].push(course)
      fs.writeFile("users.json", JSON.stringify(newDataUser), (err) => {
        if(err) throw err;
        res.send({
          message: "Course Purchased Successfully"
        })
      })
    }
    else{
      res.status(404).send("Course does not exist");
    }
    })
  })
});

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
  // logic to view purchased courses
  var username = req.user.username;
  fs.readFile("users.json", "utf-8", (err,data) => {
    if(err) throw err;
    newData = JSON.parse(data);
    var user = newData.find((element) => element.username === username)
    res.send(user['purchasedCourses']);
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});