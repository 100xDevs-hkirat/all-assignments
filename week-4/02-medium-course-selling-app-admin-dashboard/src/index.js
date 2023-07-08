const express = require('express');
const fs = require('fs');
const app = express();
const path=require("path")
const cors = require('cors');
const bodyparser=require('body-parser')
const jwt=require('jsonwebtoken')
app.use(cors())
app.use(bodyparser.json())
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let courseId=0;


const adminSecretKey="Myadminkey"

let authenticateJWTForAdmin=(req,res,next)=>{
  const authHeader = req.headers.authorization;


  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, adminSecretKey, (err, admin) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.admin = admin;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

let generateJWTForAdmin=(admin)=>{
  let adminObj={
    username:admin.username,
    password:admin.password
  }

  let adminToken=jwt.sign(adminObj,adminSecretKey)
  return adminToken
}

// const userSecretKey="Myuserkey"

// let authenticateJWTForUser=(req,res,next)=>{
//   const authHeader = req.headers.authorization;
  

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, userSecretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }

//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// }

// let generateJWTForUser=(user)=>{
//   let userObj={
//     username:user.username,
//     password:user.password,
//     purchasedCourses:user.purchasedCourses
//   }

//   let userToken=jwt.sign(userObj,userSecretKey)
//   return userToken
// }






// Admin routes
app.post('/admin/signup', (req, res) => {
  const{email,password}=req.body
  if(email.length<5 || password.length<5){
    return res.status(404).json('Username or Password not Valid')
  }
  fs.readFile("admindata.txt","utf-8",(err,data)=>{
    if(data){
    data=JSON.parse(data)
    const admin=data.find(data=>data.email==email)
    if(admin){
       return res.status(403).json("Admin already Exists")
   
    }
  }
      let newAdmin={
        email : email,
        password : password
      }
      let token=generateJWTForAdmin(newAdmin)
   
      data.push(newAdmin)
    
      fs.writeFile("admindata.txt",JSON.stringify(data),(err)=>{
        if(err){
           return res.status(404).json("Admin already Exists")
        }else{
         return  res.status(201).json({message:"Admin created successfully",token:token})
        }
        
      })
    })
  })
  
  

// app.get('/admin',(req,res)=>{
//   fs.readFile("admindata.txt","utf-8",(err,data)=>{
//     data=data.parseInt(data)
//   res.status(200).json(data)
// })
// })




app.post('/admin/login', (req, res) => { 
  const{email,password}=req.body
  fs.readFile("admindata.txt","utf-8",(err,data)=>{
    if(data){
      data=JSON.parse(data)
  const admin=data.find(admin=>admin.email==email && admin.password==password)
  if(admin){
   const adminToken=generateJWTForAdmin(admin)
   res.status(200).json({message:"Logged in successfully",adminToken})
   console.log(adminToken)
}else{
  res.status(404).json("Admin authentication failed")
}
    }
  })
});





app.post('/admin/courses', authenticateJWTForAdmin,(req, res) => {
  const body = req.body;
  if(body.title.length<6 ||body.description.length<6){
    return res.status(404).json("Invalid Details")
  }else{
  fs.readFile("getAdminCourses.txt", "utf-8", (err, data) => {
    if (err) {
     res.status(404).json("Error Occured While Reading")
    } else {
      if(data){
        data = JSON.parse(data)
      }
      body['id']=parseInt(Date.now())
        data.push(body)
      fs.writeFile("getAdminCourses.txt", JSON.stringify(data), (err) => {
        if (err) {
          res.status(404).json("Error Occured while Writing")
        }
        res.status(201).json("Course created successfully");
      });
    
  }

  });
}
});



app.put('/admin/courses/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const body = req.body;
  if(body.title.length<6 ||body.description.length<6){
    return res.status(404).json("Invalid Details")
  }else{
  fs.readFile("getAdminCourses.txt", "utf-8", (err, data) => {
    if(data){
        data = JSON.parse(data);
      }

      const course = data.find(course => course.id === courseId); 

        if(course){
          Object.assign(course,body)
          fs.writeFile("getAdminCourses.txt", JSON.stringify(data),(err) => {})
          return res.status(200).json(courseId)
        }else{
          return res.status(404).json(`Course with the ${courseId} not found`)
        }
        })
      }
      })
    



app.get('/admin/courses', (req, res) => {
  fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
    if(err){
      console.log(err)
    }else{
    data=JSON.parse(data)
      res.send(JSON.stringify(data))
    }
  })
});



// // User routes
// app.post('/users/signup', (req, res) => {
//   const{username,password}=req.headers
//   if(username.length<5 || password.length<5){
//     return res.status(404).json('Username or Password not Valid')
//   }
//   fs.readFile("userdata.txt","utf-8",(err,data)=>{
//     if(data.length>0){
//     data=JSON.parse(data)
//     const user=data.find(data=>data.username==username)
//     if(user){
//        return res.status(400).json("User already Exists")
   
//     }
//   }
//   let newUser={username,password,purchasedCourses:[]}
//   let userToken=generateJWTForUser(newUser)
//       data.push(newUser)
//       fs.writeFile("userdata.txt",JSON.stringify(data),(err)=>{
//         if(err){
//            return res.status(404).json("user already Exists")
//         }else{
//           res.status(201).json({message:"User created successfully",userToken})
//         }
        
//       })
//     })
// });




// app.post('/users/login', (req, res) => {
//   const{username,password}=req.headers
//   fs.readFile("userdata.txt","utf-8",(err,data)=>{
//     if(data){
//       data=JSON.parse(data)
//   const user=data.find(user=>user.username==username && user.password==password)
//   if(user){
//    let userToken=generateJWTForUser(user)
//    res.status(200).json({message:"Logged in successfully",userToken})

// }else{
//   res.status(404).json("user authentication failed")
// }
//     }
//   })
// });





// app.get('/users/courses',(req, res) => {
//   fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
//     if(data.length>0){
//       data=JSON.parse(data)
//       const coursesData=data.filter(data=>data.published=="True")
//       res.status(200).json(coursesData)
//     }else{
//       res.status(404).json("No courses Available")
//     }
//   })
// });





// app.post('/users/courses/:courseId',authenticateJWTForUser, (req, res) => {
//   let id=req.params.courseId
//   fs.readFile("getAdminCourses.txt","utf-8",(err,data)=>{
//     if(data){
//       data=JSON.parse(data)
//       const courseToBuy=data.find(data=>data.id==id && data.published=="True")
//       let obj={...courseToBuy}
         
//         fs.readFile("userdata.txt","utf-8",(err,userdata)=>{
//           if(userdata){
//             userdata=JSON.parse(userdata)
//             const loggedinuser=userdata.find(data=>data.username==req.user.username)
//             if(loggedinuser){
//               loggedinuser.purchasedCourses.push(obj)
//             }
            
//           fs.writeFile("userdata.txt",JSON.stringify(userdata),(err)=>{
//             res.status(200).json("course Bought Successfully")
//           })
// }else{
//   res.status(404).json("Failed to Buy Course")

// }
//         })
//       }
//     })

// });





// app.get('/users/purchasedCourses',authenticateJWTForUser,(req, res) => {
//   fs.readFile("userdata.txt","utf-8",(err,data)=>{
//     if(data){
//       data=JSON.parse(data)
//       const userPurchased=data.find(data=>data.username==req.user.username)
//       res.status(200).json(userPurchased.purchasedCourses)
//     }
//     })
// });





// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,"signupAdmin.html"))
// })
// app.get('/loginAdmin',(req,res)=>{
//   res.sendFile(path.join(__dirname,"loginAdmin.html"))
// })
// app.get('/createAdminCourse',(req,res)=>{
//   res.sendFile(path.join(__dirname,"createAdminCourse.html"))
// })
// app.get('/getAdminCourses',(req,res)=>{
//   res.sendFile(path.join(__dirname,"getAdminCourses.html"))
// })

// //USERS
// app.get('/users',(req,res)=>{
//   res.sendFile(path.join(__dirname,"signupUsers.html"))
// })
// app.get('/loginUsers',(req,res)=>{
//   res.sendFile(path.join(__dirname,"loginUsers.html"))
// })
// app.get('/showAllCourses',(req,res)=>{
//   res.sendFile(path.join(__dirname,"showAllCourses.html"))
// })
// app.get('/getPurchasedCourses',(req,res)=>{
//   res.sendFile(path.join(__dirname,"showAllPurchasedCourses.html"))
// })





app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
