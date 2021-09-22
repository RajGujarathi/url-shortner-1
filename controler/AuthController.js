var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('config');
const secratekey=config.get('secratekey')
const User=require('../models/user')
const {checkUser}=require('../middlewire/middleware')

const errorhanderler = (err) => {
    console.log(err.message, err.code)
    let error = { username:'',email: '', password: '' };

    
   
    // invalide eamil
    if (err.message.includes('Must be a valid email address')) {
        error.email = 'Write correct Email'
    }
    else if (err.message.includes('Validation error')) {
        error.username = 'UserName Must Be Unique'
    }
    //invalid password
    if (err.message.includes('Password must be 8 characture long')) {
        error.password = 'That password is incorrect . Password must be 8 characture long'
    }
    if (err.message.includes('Please enter your name')) {
        error.username = "Please enter UserName"
    }

    if (err.message.includes('Invalid username')) {
        error.username = 'write correct username .(not use"<","\'" and "/" this symblols) '
    }
    //invalid password
    if (err.message.includes('Incorrect Password')) {
        error.password = 'That password is incorrect'
    }

    //validation error

    if (err.message.includes('user validation failed')) {
        Object.values(err.error).forEach(({ properties }) => {
            error[properties.path] = properties.message
        })
    }

    //duplicate email error
    if (err.message.includes('SequelizeUniqueConstraintError')) {
        error.email = 'This is already in use'
        return error;
    }
    return error;
}

const maxage = 3 * 24 * 60 * 60;
console.log(config.secratekey)
const createtoken = (id,userName) => {
    return jwt.sign({ id,userName }, secratekey, { expiresIn: maxage })
}


module.exports.register= async (req, res) => {
    try {
        let username=req.body.username
        let password=req.body.password
        if(username.includes('<') || username.includes('/')||username.includes("'")){
            throw Error('Invalid username')
        }
        
        const user = await User.create({ userName:req.body.username,email: req.body.email, password: req.body.password })
        const token = createtoken(user._id,user.userName)
        console.log(token)
        //res.cookie('jwt', token, { httpOnly: true, maxage })
        //res.render('index')
        res.cookie('token', token, { httpOnly: true })
       res.status(200).json({user})
    
    }
    catch (err) {
        const error = errorhanderler(err)
        console.log(err)
        //   //     console.log(error)
        res.status(400).json({ error })
   }
}

module.exports.login_post = async (req, res) => {
    console.log(req.url)
    try {let userName=req.body.name
        let password=req.body.password
   //     console.log(userName+' '+password)
        const user=await User.findOne({ where:{ userName } });
        
        if(user){
            const auth=await bcrypt.compare(password,user.password)
            console.log(auth)
            if(auth){
                const token = createtoken(user._id,user.userName)
                res.cookie('token', token, { httpOnly: true ,secure: true,maxAge: 60 * 60 * 1000, })
                res.setHeader('Access-Control-Request-Headers',token)
                res.status(200).json({user:user})
                        }
            else{
          throw Error('Incorrect Password')
          }
         } 
        
    
    else{
        throw Error('Invalid username')
      }
    }
    catch (err) {
        console.log(err)
        const error = errorhanderler(err)
        console.log(error)
        res.status(400).json({ error })
    }
}

module.exports.logout=async (req, res) => {
    // Set token to none and expire after 5 seconds
    console.log(res.locals.user.userName+" Logged Out")
    await res.cookie('token', '', {
      maxAge:0.1,
        httpOnly: true,
    })
  
 res.redirect('/')
}

module.exports.Signup=async(req,res)=>{
    if(res.locals.auth){
        res.render('home',{message:"Please Logout before Signup"})
    }
    else{ res.render('siginup') }  
}


module.exports.Login=async(req,res)=>{
    console.log(req.url)

  
    if(res.locals.auth){
        res.render('home',{message:"You are alwready logged in"})
    }
    else{res.render('login')}
          
}

module.exports.profile=async(req,res)=>{
res.render('profile',{user:res.locals.user.userName,email:res.locals.user.email}) 
}

module.exports.edit=async(req,res)=>{
   var id=res.locals.user['id']
   var username=req.body.username
   var email=req.body.email
   try{
    if(username.includes('<') || username.includes('/')||username.includes("'")){
        throw Error('Invalid username')
    }
    
    var newdetails=await User.findOne({where:{id:id}})
    if(newdetails.userName===username&&newdetails.email===email){
        res.json({success:"All fields are updated"})
    }
    var newdata=await newdetails.update({userName:username,email:email})
    const token = createtoken(newdata._id,newdata.userName)
    console.log(token)
    //res.cookie('jwt', token, { httpOnly: true, maxage })
    //res.render('index')
    res.cookie('token', token, { httpOnly: true })
   
    res.status(200).json({success:"updated successfully"})
    }
 
    catch (err) {
        const error = errorhanderler(err)
        console.log(error)
        //   //     console.log(error)
        res.status(400).json({ error })
   }console.log(newdata)
}