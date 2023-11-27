const mongoose = require('mongoose');
const habitCompletionSchema = new mongoose.Schema({
  habit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  completion_date: {
    type: Date,
    required: true,
  },
  status:{
    type: String,
    enum: ['done', 'not done', 'none'],
    required: true
},
},{
    timestamps: true
});

const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);
module.exports = HabitCompletion;
