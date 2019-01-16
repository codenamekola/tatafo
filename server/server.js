//bring in the path module for easy access to other folders
//its an inbuilt module so requires no installation
const path = require('path');

const express = require('express');

const publicPath = path.join(__dirname,'../public');
//configuration for heroku
const port = process.env.PORT || 3000;

var app = express();
//use the express static middleware to point to the public path
app.use(express.static(publicPath));

app.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});