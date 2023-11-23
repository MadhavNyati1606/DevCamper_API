const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
// The below line is used to load the config file so that the environment variables can be used. 
dotenv.config({path : './config/config.env'});
connectDB();
const bootcamps = require('./router/bootcamps');
const courses = require('./router/courses');
const app = express();
// Body parser
app.use(express.json());

app.use(logger);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses)
app.use(errorHandler);      

const PORT = process.env.PORT || 5000


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${PORT}`));

process.on('unhandledRejection', (err, promise)=>{
    console.log(`error: ${err.message}`)
    // close the server connection
    server.close(()=> process.exit(1));
})