
const Sequelize = require('sequelize');
const sequelize = require('./db');
const db=require('./db')
console.log(db)
const date = require('date-and-time');
var bcrypt = require('bcryptjs');

const Url = db.define('url',{
   longurl:{
       type:Sequelize.STRING(2693),
       allowNull:false,
       validate:{
        isUrl: true,
       }
   },
   Shorturl:{
       type:Sequelize.STRING,
       allowNull:false,
       unique:true,
       validate:{

       } 
    },
    clicks:{
        type:Sequelize.DECIMAL,
        defaultValue:0

    },
    expiresIn:{
        type:Sequelize.DATE,
        defaultValue:new Date(date.addYears(new Date(), 1))
    }

},{updatedAt: false,}); 
Url.beforeCreate(async(url, options) => {
    var salt =url.createdAt
    console.log(salt)
    url.expiresIn=new Date(date.addYears(salt, 1))
    
});
(async () => {
    await db.sync();
    // Code here
})();

console.log(Url===db.models.url)

module.exports= Url
