const ErrorResponse = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

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