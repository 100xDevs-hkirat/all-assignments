const jwt = require('jsonwebtoken');



let ADMINS = [];
let COURSES = [];
let gid = 0;
const secretKey = "siriusblackinwater";

const checkAdmin = function (username, password) {
  
    return ADMINS.find((admin) => {
      return admin.username === username && admin.password === password;
    })
  ;
    
  };
const verifyToken = (req,res,next) => {
    const auth = req.headers.authorization;

    if( !auth || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message: "Please provide a token"})
    }
    const token = auth.split(' ')[1];

    jwt.verify(token,secretKey,(err, decoded ) => {
        if(err) {
            return res.status(403).json({messge: "invalide token"})
        }
        req.user = decoded;
            next();
    })
}

exports.createAdmin = (req, res) => {
    // logic to sign up admin
    const { username, password } = req.body;
    if(checkAdmin(username,password)){
      res.status(200).send({Error: "Admin Already Exists"});
    }

    const token = jwt.sign(username, secretKey )
    ADMINS.push({
      username,
      password,
    });
    
  
    res.status(201).json({
      status: "success",
      message: "Admin Created Succesfully",
      token,
      ADMINS
    });
  }

exports.loginAdmin =  (req, res) => {
    // logic to log in admin
    
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.status(404).send({
        Error: "Please Provide the username and password",
      });
    }
    
  
    if (checkAdmin(username, password)) {
        const token = jwt.sign(username, secretKey, { expiresIn : '1h'})
      res.status(200).send({ message: "Login Succesfully", token, ADMINS });
    }
  }

exports.createCourse =  (req, res) => {
    // logic to create a course
    const { username, password } = req.headers;
  
    const isAdmin = checkAdmin(username, password);
    console.log(isAdmin);
  
    if (!isAdmin) {
      res.status(403).json({ message: "Admin is Not Authorised" });
    }
  
    gid++;
  
    COURSES.push({
      id: gid,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published,
    });
  
    res.status(201).json({message: "Created Succesfully"},
    COURSES);
  }


exports.updateCourse = (req, res) => {
    // logic to edit a course
    const {username, password} = req.headers;
  
    if(!checkAdmin(username,password)){
      res.status(400).send({Message: "User Not Found"})
    }
  
    const cid = COURSES.findIndex((course) => course.id === req.params.courseId);
  
    if(cid){
        COURSES[cid].title = req.body.title;
        COURSES[cid].description = req.body.description;
        COURSES[cid].price = req.body.price;
        COURSES[cid].imageLink = req.body.imageLink;
        COURSES[cid].published = req.body.published;
        res.status(200).json({ message: "Course detailed are upadated succesfully" });
  
    }
  }

exports.getCourses = (req, res) => {
    const {username, password} = req.body;
   // console.log(username,typeof(password),checkAdmin(username, password));
    if(checkAdmin(username, password)){
      res.status(200).send({COURSES});
    }else{
      res.status(403).send({message: "Not Authorised"})
    }
  }