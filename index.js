// Import required modules and set up Express app
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const passportLocal = require('./config/passport-local-strategy');
var cloudinary = require("cloudinary");
const flash = require('connect-flash')
const custumMware = require('./config/middleware')
const Data = require('./config/middleware')

// Set up middleware and configurations
app.use(express.json());  // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));   // Parse incoming URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));   // Parse request body
app.use(cookieParser())   // Parse cookies
app.use(expressLayouts);   // Enable EJS layouts
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)
app.use(express.static('./assets'))   // Serve static files from the 'assets' directory
app.set('view engine','ejs')   // Set view engine as EJS
app.set('views','./views')     // Set views directory

// Set up session middleware
app.use(session({
    name: 'habitTracker',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: (1000 * 60 * 100)    // Session expiration time
    },
}))

// Initialize Passport and session support
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)    // Custom middleware to set authenticated user
app.use(flash())     // Enable flash messages
app.use(custumMware.setFlash)     // Custom middleware to set flash messages

// Include routes from the './routes' directory
app.use("/",require("./routes"))

// Start the server
app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`)
    }
    console.log(`server is running on port ${port}`)
})
