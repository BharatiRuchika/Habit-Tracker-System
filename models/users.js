const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  dateOfBirth:{
    type:Date,
  },
  habits:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Habit'
  }],
},{
    timestamps:true
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hashSync(this.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(this.password);
    console.log(enteredPassword);
    return await bcrypt.compareSync(enteredPassword, this.password);
}

const User = mongoose.model('User',userSchema)
module.exports = User