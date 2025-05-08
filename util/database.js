const Sequelize = require('sequelize')

const sequelize = new Sequelize("resourceXchange", "admin", "Bmrt64344", {
  dialect: "mysql",
  host: "database-rx.cjkbzu0ero3o.us-east-1.rds.amazonaws.com",
});

module.exports = sequelize; 
