const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;

// const fn = () =>{
// Here comes the body
//}

// fn => () => {body } 
// So the outer function is fn and it is calling the inner function which has no arguments and return something.