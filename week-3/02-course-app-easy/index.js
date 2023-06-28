const express = require('express');
const fs = require('fs');
const app = express();
const path=require("path")
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let courseId=0;
// Admin routes
app.post('/admin/signup', (req, res) => {
  const body=req.body
  let newAdmin={
    username : body.username,
    password : body.password
  }
  ADMINS.push(newAdmin)
  res.status(201).json("Admin created successfully")
});
app.get('/admin',(req,res)=>{
  res.status(200).json(ADMINS)
})
app.post('/admin/login', (req, res) => {
  const body=req.body
  let username=body.username
  let password=body.password
 
  const admin=ADMINS.find(admin=>admin.username==username)
  if(admin){
    if(admin.password==password){
      res.status(200).json("Logged in successfully")
    }
    else{
      res.status(404).json("failed")
  }}else{
    res.status(404).json("failed")
  }
});

app.post('/admin/courses', (req, res) => {
  const body = req.body;
  let username = body.username;
  let password = body.password;
  let title = body.title;
  let description = body.description;
  let price = body.price;
  let imagelink = body.imagelink;
  let published=body.published
  let newCourse = {
    id: ++courseId,
    username: username,
    password: password,
    title: title,
    description: description,
    price: price,
    imagelink: imagelink,
    published:published
  };

  COURSES.push(newCourse);

  fs.readFile("getAdminCourses.txt", "utf-8", (err, data) => {
    if (err) {
     res.status(404).json("Error Occured While Reading")
    } else {
      let coursesData = [];
      if (data) {
        coursesData = JSON.parse(data);
      }
      coursesData.push(newCourse);

      fs.writeFile("getAdminCourses.txt", JSON.stringify(coursesData), (err) => {
        if (err) {
          res.status(404).json("Error Occured while Writing")
        }
      });
    }
  });

  res.status(201).json("Course created successfully");
});



app.put('/admin/courses/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const body = req.body;
  fs.readFile("getAdminCourses.txt", "utf-8", (err, data) => {
    let coursesData = [];
    if(data){
        data = JSON.parse(data);
      }

      const courseIndex = data.findIndex(course => course.id === courseId);
      
      for(let i=0;i<data.length;i++){
        if(i!=courseIndex){
          coursesData.push(data[i])
        }
      }

        if(courseIndex!=-1){
            data[courseIndex].published=body.published
        }
       coursesData.push(data[courseIndex])

        fs.writeFile("getAdminCourses.txt", JSON.stringify(coursesData),{flag:'w'} ,(err) => {
 });
});
res.status(200).json("Updated")
})



app.get('/admin/courses', (req, res) => {
  fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
    if(err){
      console.log(err)
    }else{
    data=JSON.parse(data)
      res.status(200).json(data)
    }
  })
});




// User routes
app.post('/users/signup', (req, res) => {
  const body=req.body
  let newUser={
    username : body.username,
    password : body.password
  }
  USERS.push(newUser)
  res.status(201).json("User created successfully")
});

app.post('/users/login', (req, res) => {
  const body=req.body
  let username=body.username
  let password=body.password
 
  const user=USERS.find(user=>user.username==username)
  if(user){
    if(user.password==password){
      res.status(200).json("Logged in successfully")
    }
    else{
      res.status(404).json("failed")
  }}else{
    res.status(404).json("failed")
  }
});

app.get('/users/courses', (req, res) => {
  const coursesData=[]
  fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
    if(data){

      data=JSON.parse(data)
      for(let i=0;i<data.length;i++){
        if(data[i].published=="True"){
          coursesData.push(data[i])

        }
      }
      res.status(200).json(coursesData)
    }
    
   
  })
});

app.post('/users/courses/:courseId', (req, res) => {
  let coursesData=[]
  let id=req.params.courseId
  let body=req.body
  fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
    if(data){

      data=JSON.parse(data)
      for(let i=0;i<data.length;i++){
        if(data[i].id==id && data[i].published=="True"){
         data[i].username=body.username
         data[i].password=body.password
          coursesData.push(data[i])

        }
      }
      fs.readFile("coursesBought.txt","utf-8",(err,data)=>{
        if(data){
          data=JSON.parse(data)
          for(let i=0;i<data.length;i++){
            let newCourseBought = {
              id: data[i].id,
              username: data[i].username,
              password: data[i].password,
              title: data[i].title,
              description: data[i].description,
              price: data[i].price,
              imagelink: data[i].imagelink,
              published:data[i].published
            }
            coursesData.push(newCourseBought)
          
          }
          fs.writeFile("coursesBought.txt",JSON.stringify(coursesData),(err)=>{
          })
        }
      })
      
      res.status(200).json("course Bought Successfully")
    }
    
   
  })
});

app.get('/users/purchasedCourses', (req, res) => {
  fs.readFile("coursesBought.txt","utf-8",(err,data)=>{
    if(err){
      res.status(404).json("Cannot get Courses")
    }else{
      console.log(JSON.parse(data))
      res.status(200).json(JSON.parse(data))
    }
  })
});

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,"signupAdmin.html"))
})
app.get('/loginAdmin',(req,res)=>{
  res.sendFile(path.join(__dirname,"loginAdmin.html"))
})
app.get('/createAdminCourse',(req,res)=>{
  res.sendFile(path.join(__dirname,"createAdminCourse.html"))
})
app.get('/getAdminCourses',(req,res)=>{
  res.sendFile(path.join(__dirname,"getAdminCourses.html"))
})

//USERS
app.get('/users',(req,res)=>{
  res.sendFile(path.join(__dirname,"signupUsers.html"))
})
app.get('/loginUsers',(req,res)=>{
  res.sendFile(path.join(__dirname,"loginUsers.html"))
})
app.get('/showAllCourses',(req,res)=>{
  res.sendFile(path.join(__dirname,"showAllCourses.html"))
})
app.get('/getPurchasedCourses',(req,res)=>{
  res.sendFile(path.join(__dirname,"showAllPurchasedCourses.html"))
})





app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
