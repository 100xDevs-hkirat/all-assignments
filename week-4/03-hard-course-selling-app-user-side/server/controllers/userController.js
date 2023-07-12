const User = require('./../models/userModel');
const Course = require('./../models/courseModel');


exports.getAllCourses =  async (req,res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            status: "success",
            data : {
                courses
            }
        })

        

    } catch (err) {
        res.status(400).json({status: "fail" , message: err})
    }
}


exports.buyCourse = async  (req,res) => {
    try {
        const cid = req.params.courseId;
        const userId = req.headers.userid
        
        const user = await User.findById(userId);
        console.log(user.purchasedCourses);
        
        user.purchasedCourses.push(cid);
        await user.save();
        console.log(user.purchasedCourses);
        res.status(200).json({
            status: "succes",
            message: "course buyed successfully"
        })

    } catch (err) {
        res.status(400).json({status: "failjoker" , message: err})
    }
}

exports.getBuyedCourse =  async (req,res) => {
    try { 
        const user = await User.findById(req.params.id);
        
        const allCourses = await Promise.all(user.purchasedCourses.map((id) => Course.findById(id)));
       
        res.status(200).json({
            status: "success",
            data: {
                allCourses
            }
        })
    } catch (err) {
        res.status(400).json({status: "faildsfdsfdsfsd" , message: err})
    }
}
// exports.createCourse = async (req,res) => {
//     try {
        

//     } catch (err) {
//         console.log(err);
//     }
// })
// }
