require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
    //Databasse connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
        console.log('Database connect..');
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectDB;