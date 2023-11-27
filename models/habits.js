const mongoose = require('mongoose')
const habitSchema = new mongoose.Schema({
    habitName:{
        type:String,
        required:true
    },
    start_date:{
        type:Date,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{
    timestamps:true
})

const Habit = mongoose.model('Habit',habitSchema)
module.exports = Habit