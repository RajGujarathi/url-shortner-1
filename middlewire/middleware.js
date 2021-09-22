const jwt = require('jsonwebtoken');
const config = require('config');
const secratekey=config.get('secratekey')
const User=require('../models/user')
const reqireAuth = (req, res, next) => {
  const token = req.cookies['token']
  if (token) {
      jwt.verify(token, secratekey, async (err, decode) => {
          if (err) {
              console.log(err.message)
              res.redirect('/auth/login')
          }
          else {
              console.log(decode)
              next()
          }
      })
  }
  else {
      res.redirect('/auth/login');

  }

}
const checkUser = (req, res, next) => {
  const token = req.cookies['token']
  res.locals.auth = false
  if (token) {
      jwt.verify(token, secratekey, async (err, decode) => {
          if (err) {
              res.locals.user = null;
              res.locals.auth = false
              next()
          }
          else {
              let us = await User.findOne({where:{userName:decode.userName}})
              console.log(decode.userName)
              res.locals.user = us
              res.locals.auth = true
              
              next()
          }

      }
      )
  }
  else {
      res.locals.user = null
      res.locals.auth = false
      next()
  }

}


module.exports = { reqireAuth, checkUser }