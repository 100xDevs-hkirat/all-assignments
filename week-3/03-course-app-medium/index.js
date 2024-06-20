const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const secretKey = 'Test@12345';
app.use(express.json());
app.use(bodyParser.json());

let ADMINS, USERS, PURCHASED, COURSES;

// fetch file data
const fetch_file_data = (filename) => {
  try{
  data = fs.readFileSync(path.resolve(__dirname, `files/${filename}`), 'utf8').trim().split('\n');
    return data.map((line) => JSON.parse(line));
  }catch{
    return ;
  }
}
// store data in file
const store_data = (filename, payload) => {
  fs.appendFileSync(path.resolve(__dirname, `files/${filename}`), JSON.stringify(payload) + '\n');
}

// update data in a file
const update_data = (filename, record_id, updated_pyaload) => {
  // read all records and filter out the one to be updated then write back into same file with
  file_content = fetch_file_data(filename);
  fs.truncateSync(path.resolve(__dirname, `files/${filename}`), 0);
  if(file_content){
    file_content.forEach((record) =>{
      if(record.id === record_id){
        for(let key of Object.keys(updated_pyaload)) record[key] = updated_pyaload[key];
      }
      store_data(filename, record);
    });
  }
}

// create object of object from array of objects
const array_to_object = (temp_array) => {
  if(! temp_array.length) return {};
  let temp_dict = {};
  temp_array.forEach((item) => {
    for(let key of Object.keys(item)){
      temp_dict[key] = temp_dict.hasOwnProperty(key) ? 
      Array.from(new Set(temp_dict[key].concat(item[key]))) :
      item[key];
    }
  }); 
  return temp_dict;
}

  // initialize arrays from file content
  ADMINS = fetch_file_data('ADMINS.json') || [];
  COURSES = fetch_file_data('COURSES.json') || [];
  PURCHASED = array_to_object(fetch_file_data('PURCHASED.json')) || {};
  USERS = fetch_file_data('USERS.json') || [];

console.log(PURCHASED);
// generate jwt token
const create_token = (payload) => {
  return jwt.sign(payload, secretKey, {algorithm: 'HS256', expiresIn: "1h"});
}

// grab username from token
const token_decrypter = (fieldName, token) => {
  const decodedToken = jwt.verify(token, secretKey);
  if(decodedToken.hasOwnProperty(fieldName))
    return decodedToken[fieldName];
  else return null;  
}

// check for valid credentials
const token_validator = (token, list) => {
  let valid = false;
  if(! token) return valid;
  token = token.split(" ")[1];
  try{
    const user_id = token_decrypter('id', token);
    list.forEach((account) => {
      if(account.id === user_id){
         valid = true;
        }
    });
  }catch(err){
    return false;
  }
  return valid;
}

// Authenticate user at middleware level
const authenticator_middleWare = (req, res, next) => {
  if(req.url.includes('/signup') || req.url.includes('/login')) next();
  else {
    let authenticated = false;
    if(req.url.includes('/admin/')){
      authenticated = token_validator(req.headers.authorization, ADMINS);
    }else{
      authenticated = token_validator(req.headers.authorization, USERS);
    }
    authenticated ? next() : res.status(401).json({message:"Access denied"});
  }
}
app.use(authenticator_middleWare);

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  try{
    let existing_account = false;
    if(!req.body.username.length) res.status(400).json({message: 'username cannot be empty'});
    if(!req.body.password.length) res.status(400).json({message: 'password cannot be empty'});
    else{
      ADMINS.forEach((account) => {
        if(account.username === req.body.username){ 
          existing_account = true;
          res.status(403).json({message: 'username already exists. Please use another one!'});}
      });
      if(!existing_account){
        req.body.id = uuidv4();
        const accessToken = create_token(req.body);
        //req.body.token = accessToken;
        ADMINS.push(req.body);
        store_data('ADMINS.json', req.body);
        res.status(201).json({message: 'Admin created successfully', token: accessToken});
      } 
    }
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let found = false;
  ADMINS.forEach((account) => {
    if(account.username === req.headers.username && account.password === req.headers.password){
      found = true;
      const accessToken = create_token(account);
      res.status(200).send({ message: 'Logged in successfully', token: accessToken});
    }
  });
  ! found && res.status(403).json({message: "Invalid username or password"});
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  //console.log('Creating new Course');
  req.body.id = uuidv4();
  COURSES.push(req.body);
  store_data('COURSES.json', req.body);
  res.status(200).json({message: 'Course created successfully', courseId: req.body.id});
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = req.params['courseId'];
  let course_found = false;
  COURSES.forEach((course) => {
    if(course.id === courseId){
      course_found = true;
      for(let key of Object.keys(req.body)) course[key] = req.body[key];
      update_data('COURSES.json', courseId, course);
    }
  });
  course_found ? res.status(200).json({message: "Course updatd successfully"}) :res.status(403).json({message:'Invalid course id. Course not found'});
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.status(200).json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  try{
    let existing_account = false;
    if(!req.body.username.length)res.status(400).json({message: 'username cannot be empty'});
    else if(!req.body.password.length) res.status(400).json({message: 'password cannot be empty'});
    else{
      USERS.forEach((account) => {
        //console.log("Checking for existing username");
        if(account.username === req.body.username){ 
          existing_account = true;
          res.status(400).json({message: 'username already exists. Please use another one!'});}
      });
      if(!existing_account){
        req.body.id = uuidv4();
        const accessToken = create_token(req.body);
        //req.body.token = accessToken;
        USERS.push(req.body);
        store_data('USERS.json', req.body);
        res.status(201).json({message: 'User created successfully', token: accessToken});
      } 
    }
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let user_exist_flag = false;
  USERS.forEach((account) => {
    if(account.username === req.headers.username && account.password === req.headers.password){
      user_exist_flag=true ;
      const accessToken = create_token(account);
      res.status(200).send({ message: 'Logged in successfully', token: accessToken});
  }
  });
  ! user_exist_flag && res.status(403).json({message: "Invalid username of passowrd"});
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  res.status(200).json({courses: COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const purchasedCourseId = req.params["courseId"];
  let validateCourseId = false;
  let same_course_purchsed = false;
  const user_id = token_decrypter('id', req.headers.authorization.split(' ')[1]);
  COURSES.forEach((course) => {
    if(course.id === purchasedCourseId){
      validateCourseId = true;
      if(Object.keys(PURCHASED).includes(user_id)){
        PURCHASED[user_id].forEach((course_bought_id) => {
          if(course_bought_id === purchasedCourseId) same_course_purchsed = true;
        });
        ! same_course_purchsed && PURCHASED[user_id].push(course.id) && store_data('PURCHASED.json', PURCHASED);
      }else{
        PURCHASED[user_id] = [course.id];
      }
      ! same_course_purchsed && res.status(200).json({message: 'Course purchased successfully'});
    } 
  });
  validateCourseId && same_course_purchsed && res.status(400).json({message: "You've already purchased this course before. No need to buy again."});
  ! validateCourseId && res.status(403).json({message: 'Invalid course id'});
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const user_id = token_decrypter('id', req.headers.authorization.split(' ')[1]);
  let user_course = [];
  if(PURCHASED[user_id])
  user_course = COURSES.filter((course) => PURCHASED[user_id].includes(course.id));
  res.status(200).json({purchasedCourses: user_course});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
