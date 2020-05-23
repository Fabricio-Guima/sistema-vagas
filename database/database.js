const Sequelize = require('sequelize');

const connection = new Sequelize('bdvagas','root', 'admin',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"

});


module.exports = connection;