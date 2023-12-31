const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env'});

// load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
// Import into DB
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);

        console.log('Data Imported...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// Delete data from DB
const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data Deleted...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}