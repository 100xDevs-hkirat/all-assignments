const Course = require('../models/courseModel');
const User = require('../models/userModel');

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: {
        course: newCourse,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      status: 'success',
      courses,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOneCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send('No course found with that ID');
    }
    res.status(200).json({
      status: 'success',
      course,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    // BUG - If course not found, its not executing this
    if (!course) {
      return res.status(404).send('No course found with that ID');
    }

    res.status(200).json({
      status: 'success',
      message: `Course updated with id ${req.params.courseId}`,
      course,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.buyCourse = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { purchasedCourses: req.params.courseId },
    });

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send('No course found with that ID');
    }
    res.status(200).json({
      status: 'success',
      message: `Course purchased successfully for ${req.user.email}`,
      course,
    });
  } catch (error) {
    res.status(404).send('No course found with that ID', error.message);
  }
};

exports.getPurchasedCourses = async (req, res) => {
  User.findById(req.user._id)
    .populate('purchasedCourses')
    .then((user) => {
      res.status(200).json({
        status: 'success',
        message: `List of courses purchased by the user ${user.email}`,
        purchasedCourses: user.purchasedCourses,
      });
    })
    .catch((err) => res.status(404).send('Failed to fetch user', err.message));
};
