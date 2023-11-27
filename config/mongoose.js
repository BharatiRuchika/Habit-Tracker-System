const mongoose = require("mongoose")

// Connect to the MongoDB database with the specified URL and options
var con =  mongoose.connect(`mongodb+srv://guvi:admin123@cluster0.bdpws.mongodb.net/HabitTracker?retryWrites=true&w=majority`,{
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true,   // Use the new Server Discovery and Monitoring engine
})
const db = mongoose.connection;

// Event listener for MongoDB connection error
db.on('error',console.error.bind(console,"Error Connecting to MongoDB"))

// Event listener for a successful MongoDB connection
db.once('open',function(){
    console.log('Connected to Database :: MongoDB')
})

// Export the database connection object to be used in other parts of the application
module.exports = db;




