const Sequelize = require('sequelize');
const connection = require('../database/database');

//importar o model company para fazer relacionamento
// uma empresa pode ter várias vagas e uma vaga pertence a uma empresa
const Company = require('../companies/Company');

// criando tabela com o nome jobs
const Job = connection.define('jobs',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salary: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    companyjob: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    flagnewjob: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    companyId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Company.hasMany(Job);
Job.belongsTo(Company);



module.exports = Job;

