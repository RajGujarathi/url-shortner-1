const {Router, request}=require('express')
const router=Router()
const rateLimit=require('express-rate-limit')
const {reqireAuth} = require('../middlewire/middleware');
const loginlimit = rateLimit({
    max: 10,// max requests
    windowMs:  60*60 * 1000, // 1 mini
    message: 'Too many requests' // message to send

});
const signuplimit = rateLimit({
    max: 2,// max requests
    windowMs:  60 * 1000, // 1 mini
    message: 'Too many requests' // message to send

});
const auth=require('../controler/AuthController')
//const check=require('../middlewear/authmiddle')

router.get('/auth/Signup',auth.Signup)
router.get('/auth/login',auth.Login)

router.post('/auth/Signup',signuplimit,auth.register)
router.post('/auth/login',loginlimit,auth.login_post)
router.get('/auth/logout',auth.logout)
router.get('/auth/profile',reqireAuth,auth.profile)
router.post('/auth/profile',reqireAuth,auth.edit)
//router.post('/auth',check.checkUser)

module.exports=router;