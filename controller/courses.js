const ErrorResponse = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all Courses/ Get courses from specific bootcamp
// @route   Get /api/v1/courses || /api/v1/bootcamps/:bootCampId/courses
// @access  Public
exports.getCourses = asyncHandler( async (req,res,next) =>{
    let query;

    if(req.params.bootcampId){
        query = Course.find({ bootcamp: req.params.bootcampId })
    }else{
        query = Course.find().populate('bootcamp');
    }

    const courses = await query;
    res.status(200).json({ success:true, count: courses.length, data: courses});
})

// @desc    Get all Courses/ Get courses with id
// @route   Get /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler( async (req,res,next) =>{
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course){
        return next(new ErrorResponse(`No Course found with id ${req.params.id}`));
    }
    res.status(200).json({ success:true, data: course});
})

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    //  
  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
        404
      );
    }
  
    // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //       401
    //     )
    //   );
    // }
  
    const course = await Course.create(req.body);
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
  
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

  // @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
  
    await course.deleteOne();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });