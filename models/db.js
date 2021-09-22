const { Sequelize,DataTypes } = require('sequelize');
const config = require('config');
const dbConfig = config.get('Customer.dbConfig');
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.db
  })
  console.log(config.secratekey)
  sequelize.authenticate().then(function(errors) { 
      if(errors){console.log(errors)}
    else{
        console.log("Connected successfully");
    } });


  module.exports=sequelize