//external imports
const express = require('express');
const app = express();
const path = require('path');

//port
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

// database connection
const connectDB = require('./config/db');
connectDB();
// Templeate Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/public')));
//routes
app.use('/api/files', require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));
//app listen
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})