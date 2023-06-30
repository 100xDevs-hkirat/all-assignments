let COURSES = []
let USERS = [];

const checkUser = function (username, password) {
  
    return USERS.find((user) => {
      return user.username === username && user.password === password;
    })
  ;
    
  };
exports.createUser = (req, res) => {
    const { username, password } = req.body;
    if(checkUser(username,password)){
      res.status(400).json({message:"User Already Exists"});
    }
    
    USERS.push({
      username,
      password,
      purchasedCourses: []
    });
  
    res.status(201).json({
      status: "success",
      message: "User Created Succesfully",
      USERS
    });
  }

exports.loginUser = (req, res) => {
    // logic to log in user
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.status(404).send({
        Error: "Please Provide the username and password",
      });
    }
  
    
  
    if (checkUser(username, password)) {
      res.status(200).send({ message: "Login Succesfully", USERS });
    }
  }


exports.getUserCourses = (req, res) => {
    // logic to list all courses
    const {username, password} = req.body;
    if(checkUser(username, password)){
      res.status(200).send({COURSES});
    }else{
      res.status(403).send({message: "Not Authorised"})
    }
  }


exports.purchaseCourse = (req, res) => {
    // logic to purchase a course
    const {username, password} = req.headers;
  
    if(!checkUser(username,password)){
      res.status(400).send({Message: "User Not Found"})
    }
     const cid = COURSES.findIndex((course) => course.id === req.params.courseId);
  
     if(cid){
      purchasedCourses.push(COURSES[cid])
      res.status(200).send({Buyed_courses: purchasedCourses})
     }
  
  }

exports.getPurchasedCourses =  (req, res) => {
    const {username, password} = req.body;
    // logic to view purchased courses
    if (!checkUser()) {
      res.status(403).json({ message: "Forbidden or Unauthorised" });
    } else {
      res.status(200).json({ purchasedCourses });
    }
  }
