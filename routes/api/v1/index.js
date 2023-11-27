// Import the Express module and create a router
const express = require("express");
const router = express.Router();

// Use the '/users' prefix and include routes from the 'users' subdirectory
router.use('/users',require('./users'))

// Export the router to make it accessible in other parts of the application
module.exports = router

