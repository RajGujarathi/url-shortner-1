var express = require('express');
var db=require('./models/db')
var model=require('./models/models')
var app = express();
const router=require('./Routes/router')
const authrout=require('./Routes/authroutes')
var cors = require('cors')
const {checkUser}=require('./middlewire/middleware')
const cookieParser = require('cookie-parser');
bodyParser = require("body-parser"),

app.use(bodyParser.urlencoded({ extended: true }));
  

// app.use(function(req, res, next) {
//     res.header('Content-Type', 'text/html;charset=UTF-8')
//     res.header('Access-Control-Allow-Credentials', true)
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     )
//     next()
//   })

  app.use(cors())
  app.use(cookieParser());
  app.use('/public',express.static('public'))
  app.set('view engine','ejs')
//app.use(limit)
app.set('port', (process.env.PORT || 3001));
app.use(express.json({
    //extended: false,
    limit: '2kb' 
})) //parse incoming request body in JSON format.
app.use('*',checkUser)
const config = require('config');
const dbConfig = config.get('Customer.dbConfig');
//console.log(dbConfig.dbName)
app.get("/",(req,res)=>{
  res.render('home',{message:""})
})


app.use(authrout)
app.use(router)

// app.get('/isauthenticate',auth,(req,res)=>{
//   res.json({loggedIn:'true'})
// })
// Listen on assigned port
app.listen(app.get('port'), function () {
    console.log('listening on port ' + app.get('port'));
});