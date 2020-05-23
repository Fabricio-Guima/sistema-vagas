const express = require('express');
const router = express.Router();
//Model Job
const Job = require('./Job');
//MiddleWare
const adminAuth = require('../middlewares/adminAuth');

router.get('/jobs/:id', (req, res)=>{
    let id = req.params.id;
    Job.findOne({
        where: {id: id}
    }).then( job =>{

        if( job != undefined){

        res.render('admin/companies/details',{job: job});
       

        } else {
            res.redirect('/');
        }
    }).catch(err =>{
        res.redirect('/');
    })
   
});




module.exports = router;