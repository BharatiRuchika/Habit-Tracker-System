// Import the Express module and create a router
const express = require("express");
const router = express.Router();

// Import Passport for authentication
const passport = require('passport')

// Import the users API controller
const users_api = require('../../../controllers/api/v1/users_api')

// Route for user sign-in
router.get('/sign-in',users_api.signIn)

// Route for user sign-up
router.get('/sign-up',users_api.signUp)

// Route for creating a new user
router.post('/create',users_api.create)

// Route for creating a user session using local authentication strategy
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/'},),users_api.createSession)

// Route for displaying habit creation form
router.get('/habit/displayCreate',passport.checkAuthentication,users_api.displayCreate)

// Route for creating a new habit
router.post('/habit/create',passport.checkAuthentication,users_api.createHabit)

// Route for deleting  habit
router.delete('/habit/delete',passport.checkAuthentication,users_api.deleteHabit)

// Route for changing habit status
router.post('/habit/changeStatus',passport.checkAuthentication,users_api.changeStatus)

// Route for getting habit status
router.get('/habit/getStatus',passport.checkAuthentication,users_api.getStatus)

// Route for displaying the week view
router.get('/habit/displayWeekView',passport.checkAuthentication,users_api.displayWeekView)

// Route for user sign-out
router.get('/sign-out',passport.checkAuthentication,users_api.destroySession)

// Export the router to make it accessible in other parts of the application
module.exports = router


