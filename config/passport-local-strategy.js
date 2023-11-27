// Import necessary modules for authentication
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/users")

// Configure the LocalStrategy for username and password authentication
passport.use(new LocalStrategy({
    usernameField:'email',    // The username field is expected to be an email
},
function(email,password,done){
     // Check if a user with the provided email exists and the password matches
    User.findOne({email:email}).then(async(user)=>{
        if(!user){
            return done(null,false)   
        }
        const isPasswordMatch = await user.comparePassword(password)
        if(!isPasswordMatch){
            return done(null,false) 
        }
        return done(null,user)    // Authentication successful
    }).catch((error)=>{
        return done(error)
    })
}
))


// Serialize user information for session storage
passport.serializeUser(function(user,done){
    done(null, user.id)
})

// Deserialize user information from session storage
passport.deserializeUser(function(id,done){
    User.findById(id).then((user)=>{
        return done(null,user)
    }).catch((error)=>{
        return done(error)
    })
})

// Middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/api/v1/users/sign-in')
}

// Middleware to set the authenticated user information in locals for views
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user
    }
    next()
}

// Export the configured passport for use in other parts of the application
module.exports = passport