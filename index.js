const express = require("express");
const app = express();
const connection = require("./database/database");
const bodyParser = require("body-parser");
const session = require("express-session");
//Controllers
const JobsController = require("./jobs/JobsController");
const CompaniesController = require("./companies/CompaniesController");
//Models
const Job = require("./jobs/Job");
const Company = require("./companies/Company");
//Buscas no Sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//View Engine
app.set("view engine", "ejs");

//Sessions
app.use(
  session({
    secret: "palavrasecretasdjkksjndsjdosjdosjhmlkm",
    cookie: { maxAge: 2000000 },
  })
);

//Static
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o BD feita com sucesso");
  })
  .catch((err) => {
    console.log("Conexão com o BD sem sucesso! ", err);
  });

//Controllers config
app.use("/", JobsController);
app.use("/", CompaniesController);

//Main route
app.get("/", (req, res) => {

    let search = req.query.job;
    let query = "%" + search + "%";

    if(!search){
        Job.findAll({ raw: true,
            order: [["id", "DESC"]] ,
           })
           .then((jobs) => {
             res.render("index", { jobs: jobs });
           })
           .catch((err) => {
             console.log(err);
           });
    }else {
        Job.findAll({
            where: { title: {[Op.like]: query }},
            order: [["createdAt", "DESC"]],
        }).then(jobs =>{
            res.render('index.ejs', {jobs: jobs});
        }).catch(err =>{
            console.log("Não foi possível consultar os dados!", err);
        })
    }


 
});

app.listen(8080, () => {
  console.log("Servidor ON!");
});
