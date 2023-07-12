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

exports.createAdmin =  (req, res) => {
  const { username, password } = req.body;
  const admin = ADMINS.find(a => a.username === username);
  console.log("admin signup");
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    const newAdmin = { username, password };
    ADMINS.push(newAdmin);
    fs.writeFileSync('admins.json', JSON.stringify(ADMINS));
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
  }
}
exports.loginAdmin =  (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
}

exports.createCourse =  (req, res) => {
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  fs.writeFileSync('courses.json', JSON.stringify(COURSES));
  res.json({ message: 'Course created successfully', courseId: course.id });
}

exports.updateCourse =  (req, res) => {
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync('courses.json', JSON.stringify(COURSES));
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}

exports.getCourses = (req, res) => {
  res.json({ courses: COURSES });
}