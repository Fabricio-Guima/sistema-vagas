const express = require("express");
const router = express.Router();
//Model Company
const Company = require("./Company");
const Job = require("../jobs/Job");
const bcrypt = require("bcryptjs");
//MiddleWare
const adminAuth = require("../middlewares/adminAuth");

router.get("/register", (req, res) => {
  res.render("admin/companies/register");
});

router.post("/register/save", (req, res) => {
  let { company, cnpj, recruiter, email, password, status } = req.body;
  cnpj = parseInt(cnpj);
  status = parseInt(status);

  Company.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);

      Company.create({
        company,
        cnpj,
        recruiter,
        email,
        password: hash,
        status,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect("/register");
          console.log("Erro ao salvar empresa no bd!", err);
        });
    } else {
      res.redirect("/register");
    }
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/authenticate", (req, res) => {
  let { email, password } = req.body;

  Company.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      let correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
          status: user.status,
        };
        res.redirect("/admin/companies/jobs");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/login");
});

router.get("/companies", adminAuth, (req, res) => {
  res.send("Rota de empresas cadastradas!");
});

router.get("/admin/companies/jobs", adminAuth, (req, res) => {
  let sessao = req.session.user;

  Company.findOne({
    where: {
      id: sessao.id,
    },
  }).then((company) => {
    if (company != undefined) {
      Job.findAll({
        raw: true,
        where: {
          companyId: company.id,
        },
        order: [["id", "DESC"]],
      })
        .then((jobs) => {
          res.render("admin/companies/index", { jobs: jobs });
        })
        .catch((err) => {
          res.redirect("/");
        });
    } else {
      res.redirect("/");
    }
  });
});

router.get("/admin/companies/jobs/new", adminAuth, (req, res) => {
  res.render("admin/companies/new");
});

router.post("/admin/companies/jobs/save", adminAuth, (req, res) => {
  let { title, description, companyjob, email, salary, flagnewjob } = req.body;

  salary = parseInt(salary);
  flagnewjob = parseInt(flagnewjob);

  let sessao = req.session.user;

  Job.create({
    title,
    description,
    salary,
    companyjob,
    email,
    flagnewjob,
    companyId: sessao.id,
  })
    .then(() => {
      res.redirect("/admin/companies/jobs");
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.get("/admin/companies/jobs/edit/:id", adminAuth ,(req, res) => {
  let { id } = req.params;

  Job.findOne({
    where: { id: id },
  })
    .then((job) => {
      res.render("admin/companies/edit", { job: job });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.post("/admin/companies/jobs/update", adminAuth ,(req, res) => {
  let {
    id,
    title,
    description,
    salary,
    companyjob,
    email,
    flagnewjob,
  } = req.body;

  Job.update(
    {
      title,
      description,
      salary,
      companyjob,
      email,
      flagnewjob,
    },
    {
      where: { id: id },
    }
  )
    .then(() => {
      res.redirect("/admin/companies/jobs");
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.post("/admin/companies/jobs/delete", adminAuth ,(req, res) => {
  let { id } = req.body;
  if (id != undefined) {
    if (!isNaN(id)) {
      Job.destroy({
        where: { id: id },
      }).then(() => {
        res.redirect("/admin/companies/jobs");
      });
    }else {
      res.redirect("/admin/companies/jobs");
    }
  } else {
    res.redirect("/admin/companies/jobs");
  }
});

module.exports = router;
