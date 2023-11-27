// Import the Habit model for database interaction
const Habit = require('../models/habits')

// Controller function for rendering the home page
module.exports.home = async function(req,res){
    try{
        // Retrieve the authenticated user from the request
        let user = req.user

        // Fetch habits associated with the current user and populate the 'user' field
        let habits = await Habit.find({
            user:user._id
        }).populate('user')
        console.log('habits',habits)

        // Render the home page with habits data
        return res.render('home', {
            title: "Home",
            habits:JSON.stringify(habits)
        })
    }catch(error){
        // Log any errors that occur during the process
        console.log('error',error)
    }
}