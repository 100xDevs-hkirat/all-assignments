const Admin = require('./../models/adminModel');
const Course = require('./../models/courseModel');


exports.createCourse = async (req,res) => {
    try{
        const course = await Course.create(req.body)
        res.status(201).json({
            message: "success",
            data: {
                course
            }
        })
    } catch (err) {
        res.status(400).json({
            status : "fail",
            something: "in this route",
            message: err
        })
    }
}

exports.updateCourse = async (req,res) => {
    try{
        const { courseId } = req.params;
        
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          req.body,
          { new: true }
        );
    
        if (!updatedCourse) { return res.status(404).json({status: 'fail', message: 'Course not found', });
        }
    
        res.status(200).json({
          status: 'success',
          data: {
            course: updatedCourse,
          },
        });
      } catch (err) {
        res.status(400).json({
            status : "fail",
            message: err
        })
    }
}


exports.getAllCourses = async (req,res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            status: "SUCCESS",
            data: {
                courses
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail", message: err
        })
    }
}



exports.getCourse = async (req,res) => {
    try {
        console.log(typeof(req.params.id));
       
        const course = await Course.findById(req.params.id);
        console.log(course);

        res.status(200).json({
            status: "SUCCESS",
            course
        })
    } catch (err) {
    
        res.status(400).json({
            status: "failsdfasfa", message: err
        })
    }
}


exports.deleteCourse = async (req,res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "SUCCESS",
            messag : "delteed succeesfully ",
            course
        })
    } catch (err) {
        res.status(400).json({
            status: "fail", message: err
        })
    }
}