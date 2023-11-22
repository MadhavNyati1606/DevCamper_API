const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootCamp, 
    UpdateBootcamp,
    deleteBootcamp,
    getBootcampByRadius } = require('../controller/bootcamps');
const router = express.Router();
router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);
router.route('/').get(getBootcamps).post(createBootCamp);
router.route('/:id').get(getBootcamp).put(UpdateBootcamp).delete(deleteBootcamp);

module.exports = router;