const ErrorResponse = require('../utils/errorClass');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all BootCamps
// @route   Get /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) =>{
        let query;

        // copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'limit', 'page'];

        // loop over the remove fields and remove them from the reqQuery
        removeFields.forEach(val => delete reqQuery[val]);
        console.log(reqQuery);
        
        // create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        //select fields
        if(req.query.select){
                const fields = req.query.select.split(',').join(' ');
                console.log(fields);
                query = query.select(fields);
        }

        //sort fields
        if(req.query.sort){
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
        }else{
                query=query.sort('-createdAt')
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit,10)|| 100;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);
       
        // Executing Query
        const bootcamps = await query;

        // Pagination result 
        const Pagination = {};

        if(endIndex < total){
                Pagination.next = {
                        page: page+1,
                        limit
                }
        }
        if(startIndex > 0){
                Pagination.prev = {
                        page: page-1,
                        limit
                }
        }

        res.status(200).json({ success: true,count:bootcamps.length, Pagination, data: bootcamps})
    
});

// @desc    Get a BootCamp
// @route   Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) =>{

        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp});
})

// @desc    Create a BootCamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootCamp = asyncHandler(async (req, res, next) =>{
   
        const bootcamp = await Bootcamp.create(req.body);
   res.status(201).json({
    success: true,
    data: bootcamp
    })
})

// @desc    Update a BootCamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Public
exports.UpdateBootcamp = asyncHandler(async (req, res, next) =>{
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        if(!bootcamp){
            return res.status(400).json({ success:false});
        }   
        res.status(200).json({ success:true, data: bootcamp });
     
})

// @desc    Delete a BootCamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
                );
        }

        bootcamp.deleteOne();

        res.status(200).json({ success:true, data: {}});
    
})

// @desc    Get a BootCamp within the specified radius 
// @route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampByRadius = asyncHandler(async (req, res, next) =>{
        const { zipcode, distance } = req.params;

        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        const radius = distance/3963;

        const bootcamps = await Bootcamp.find({
                location: { $geoWithin: { $centerSphere: [ [lng, lat], radius]} }
        });
        res.status(200).json({
                success:true,
                count: bootcamps.length,
                data: bootcamps
        })
})