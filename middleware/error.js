const ErrorResponse = require("../utils/errorClass");

const errorhandler = (err, req, res, next) =>{
    let error = { ...err };
    // console.log(err.stack);
    console.log(err);
    error.message = err.message;
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    if(error.code=== 11000){
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }
    if(err.name=== 'ValidationError'){
        const message = Object.values(error.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorhandler;