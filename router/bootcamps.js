const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootCamp, 
    UpdateBootcamp,
    deleteBootcamp,
    getBootcampByRadius } = require('../controller/bootcamps');

const courseRouter = require('./courses');
 

const router = express.Router();
// re-route the bootcampID/course url 
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);
router.route('/').get(getBootcamps).post(createBootCamp);
router.route('/:id').get(getBootcamp).put(UpdateBootcamp).delete(deleteBootcamp);

module.exports = router;