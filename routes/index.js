// Import the Express module and create a router
const express = require("express");
const router = express.Router();
console.log("router loaded")

// Import the Passport module for authentication
const passport = require('passport')

// Import the home controller
const homeController = require("../controllers/homeController");

// Define a route for the home page with authentication check using Passport
router.get("/",passport.checkAuthentication,homeController.home)

// Use the '/api' prefix and include routes from the 'api' subdirectory
router.use('/api',require('./api'))

// Export the router to make it accessible in other parts of the application
module.exports = router




