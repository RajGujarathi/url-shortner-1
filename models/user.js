const Sequelize = require('sequelize');
const sequelize = require('./db');
const db=require('./db')
console.log(db)
const date = require('date-and-time');
var bcrypt = require('bcryptjs');

const User=db.define('user',{
    userName:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notNull: {
              msg: 'Please enter your name'
            },
          }    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull: {
                msg: 'Please enter your name'
              },
              isEmail: {
                msg: "Must be a valid email address",
              }
        }},
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull: {
            msg: 'Please enter Password'
          },
        
        }
    }
    
})
User.beforeCreate(async(user, options) => {
    var salt = bcrypt.genSaltSync(8);
    console.log(salt)
    console.log(user.password.length+'gggggggggggggggggggggggggg')
    if(user.password===null||user.password.length<8){
        throw new Error('Password must be 8 characture long')
    }
    return bcrypt.hash(user.password, salt)
        .then(hash => {
            console.log(hash)
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
});
module.exports=User