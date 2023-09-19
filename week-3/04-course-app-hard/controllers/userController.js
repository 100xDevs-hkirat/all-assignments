
const User = require('./../models/userModel');
const Course = require('./../models/courseModel');



const secretKey = "siriusblackinwater";

const checkUser = function (username, password) {
  
    return USERS.find((user) => {
      return user.username === username && user.password === password;
    })
  ;
    
  };
exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    
    const checkUser = await User.findOne({username});
    if(checkUser) {
      res.status(403).json({message: 'User already exists'});
    }else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  }

exports.loginUser = async (req, res) => {
    // logic to log in user
    const { username, password } = req.body;
  
    const checkUser = await User.findOne({username,password});

    if(checkUser) {
      const token = jwt.sign({username}, secretKey, {expiresIn: '1h'});
      res.json({message: "Login Successfully"})
    }

  }


exports.getUserCourses = async (req, res) => {
    // logic to list all courses
    const courses = await Course.find({published: true});
    res.json({ courses });
  

  }


exports.purchaseCourse = async (req, res) => {
    // logic to purchase a course
    const course = await Course.findById(req.params.courseId);
    console.log(course);
    if (course) {
      const user = await User.findOne({ username: req.user.username });
      if (user) {
        user.purchasedCourses.push(course);
        await user.save();
        res.json({ message: 'Course purchased successfully' });
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }

exports.getPurchasedCourses =  async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
  }
