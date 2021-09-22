const {Router, request}=require('express')
const router=Router()
const {reqireAuth} = require('../middlewire/middleware');
const rateLimit=require('express-rate-limit')
const encodelimit = rateLimit({
    max: 5,// max requests
    windowMs:  10 * 1000, // 10 sec
    message: 'Too many requests' // message to send

});

const controler=require('../controler/controler')
 router.post('/encode',controler.encode)
 router.get('/preview/:shortner',encodelimit,controler.preview)
 
 router.post('/details',encodelimit ,reqireAuth,controler.details)
 router.get('/details',encodelimit,reqireAuth,controler.page)
 
 router.get('/about',controler.about)
 
 router.get('/:shortner', controler.shortner )
 
 module.exports=router;