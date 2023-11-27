const User = require('../../../models/users')
const Habit = require('../../../models/habits')
const HabitCompletion = require('../../../models/habitCompletion')

// Route handler for user sign-in
module.exports.signIn = function(req,res){    
    
    // Check if the user is already authenticated and redirect if so
    if (req.isAuthenticated()){
        return res.redirect("/")
    }

    // Render the sign-in page
    return res.render('user_sign_in',{
        title:"habitTrackingSystem | Signin"
    })
}

// Route handler for user sign-up
module.exports.signUp = function(req,res){
    try{
        // Check if the user is already authenticated and redirect if so
        if (req.isAuthenticated()){
            return res.redirect("/")
        }
    
        // Render the sign-up page
        return res.render('user_sign_up',{
            title:"habitTrackingSystem | Signup"
        })
    }catch(error){

    }
}

// Route handler for creating a new user
module.exports.create = async function(req,res){
    try{
    const {fullName,email,password,dateOfBirth} = req.body
    
    // Check if the password matches the confirmation
    if(req.body.password!=req.body.confirmPassword){
        return res.redirect('/api/v1/users/sign-up')
    }   
    
    // Check if the user already exists
    const user = await User.findOne({email})
    if(!user){
        
        // Create a new user
        const data = await User.create({
            fullName,
            email,
            password,
            dateOfBirth,
        })
        
        // Flash a success message and redirect
        req.flash('success','sign up successfully')
        return res.redirect('/')
    }else{
        // Flash an error message and redirect to sign-up page
        req.flash('error','User already present')
        return res.redirect('/api/v1/users/sign-up')
    }
    }catch(error){
        console.log('error',error)
        return res.redirect('/api/v1/users/sign-up')
    }
}

// Create User Session (Log In)
module.exports.createSession = async function(req,res){
    try{
        console.log('im in create session')
        
        // Flash a success message and redirect to the homepage
        req.flash('success','logged in successfully')
        return res.redirect('/')
    }catch(error){
        console.log("*******",error)
        return res.status(401).json({
            message:'Internal Server Error'
        })
    }
}

// Route handler for displaying the habit creation form
module.exports.displayCreate = async function(req,res){
    try{
        return res.render('create_habit',{
            title:"habitTrackingSystem | Create Habit"
        })
    }catch(error){
        console.log('error',error)
    }
}

// Route handler for creating a new habit
module.exports.createHabit = async function(req,res){
    try{
        console.log('body',req.body)
        let result = await Habit.create({
            user:req.user._id,
            habitName:req.body.habitName,
            start_date:new Date().toISOString().split('T')[0],
            question:req.body.habitDescription
        })
        console.log('result',result)
        let user = await User.findById(req.user.id)
        user.habits.push(result.id)
        await user.save()
        req.flash('success','habit created successfully')
        return res.redirect('/')
    }catch(error){
        console.log('error',error)
    }
}

module.exports.deleteHabit = async function(req,res){
    try{
       console.log('body',req.body)
       let id = req.body.habit_id
       let habit = await Habit.findByIdAndDelete(id)
       await HabitCompletion.deleteMany({habit_id:id})
       let user = await User.findById(req.user.id)
       user.habits.pull(id)
       user.save()
       if(req.xhr){
        return res.status(200).json({
          data:{
            habit:habit
          },
          success: true,
        });
      } 
    }catch(error){
        console.log('error',error)
    }
}

// Route handler for changing habit status
module.exports.changeStatus = async function(req,res){
    try{
        let Habit = await HabitCompletion.find({
            completion_date:req.body.completion_date,
            habit_id:req.body.habit._id
        })
        if (Habit.length==0){
            await HabitCompletion.create({
                habit_id:req.body.habit._id,
                completion_date:req.body.completion_date,
                status:req.body.status
            })
        }else{
            Habit[0].status = req.body.status
            await Habit[0].save()
        }
        if(req.xhr){
            return res.status(200).json({
              data:{
                habit:Habit
              },
              success: true,
            });
          } 
    }catch(error){
        console.log('error',error)
    }
}

// Route handler for getting habit status
module.exports.getStatus = async function(req,res){
    try{
        let date1 = new Date(req.query.completion_date)
        let habit = await HabitCompletion.find({
            completion_date:date1,
            habit_id:req.query.habit._id
        })
        console.log('habit',habit)
        if(req.xhr){
            return res.status(200).json({
                data:{
                  habit:habit
                },
                success: true,
            });
        }
    }catch(error){
        console.log('error',error)
    }
}

// Route handler for displaying the week view
module.exports.displayWeekView = async function(req,res){
    try{
        let user = req.user
        let habits = await Habit.find({
            user:user._id
        }).populate('user')
        return res.render('habits_week_view', {
            title: "habits_week_view",
            habits:JSON.stringify(habits)
        })
    }catch(error){
        console.log('error',error)
    }
}


// Destroy User Session (Log Out)
module.exports.destroySession = function(req,res){
    console.log('im in destroy session')
    req.logout(()=>{
    }); 
  res.clearCookie('habitTracker'); 
return res.redirect("/")
}