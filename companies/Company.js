const Sequelize = require('sequelize');
const connection = require('../database/database');
// criando tabela com o nome companies
const Company = connection.define('companies',{
    company: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cnpj: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    recruiter: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },    
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
    
});



module.exports = Company;