const express = require('express');
const router = express.Router();

let Trainer = require('../models/trainer');
let Teacher = require('../models/teacher');

router.get("/add", ensureAuthenticated, function(req, res){
  res.render("add_trainer", {
    title: 'Add Fitnesscenter'
  });
});

router.post('/add', function(req, res){
  req.checkBody('trainername', 'Trainername is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('otinfo', 'Other info is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_trainer', {
      title: 'Add Fitnesscenter',
      errors:errors
    });
  } else {
    let trainer = new Trainer();
    trainer.trainername = req.body.trainername;
    trainer.address = req.body.address;
    trainer.phone = req.body.phone;
    trainer.email = req.body.email;
    trainer.trainerfeed = req.body.trainerfeed;
    // if(req.file) trainer.photo = '/uploads/' + req.file.filename;
    trainer.classes = req.body.classes;
    trainer.author = req.user._id;
    trainer.otinfo = req.body.otinfo;
    trainer.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Trainer Added');
        res.redirect('/trainer_list');
      }
    });
  }
});

router.get('/:id', function (req, res) {
  Trainer.findById(req.params.id, function(err, trainer){
    Teacher.findById(trainer.author, function(err, teacher){
      res.render('trainer', {
        trainer: trainer,
        author: teacher.name
      });
    });
  });
});

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Trainer.findById(req.params.id, function(err, trainer){
    if (trainer.author != req.user._id) {
      req.flash('danger', 'Not Authorized !');
      res.redirect('/');
    }
    res.render('edit_trainer', {
      title: 'Edit Tainer',
      trainer: trainer,
    });
  });
});

router.post('/edit/:id', function(req, res){
  let trainer = {};
  trainer.trainername = req.body.trainername;
  trainer.address = req.body.address;
  trainer.phone = req.body.phone;
  trainer.email = req.body.email;
  trainer.trainerfeed = req.body.trainerfeed;
  trainer.classes = req.body.classes;
  trainer.otinfo = req.body.otinfo;
  trainer.author = req.user._id;
  let query = {_id:req.params.id}
  Trainer.update(query, trainer, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      req.flash('success', 'Trainer Updated');
      res.redirect('/trainer_list');
    }
  });
});

router.delete('/:id', function(req, res){
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Trainer.findById(req.params.id, function(err, trainer){
    if (trainer.author != req.user._id) {
      res.status(500).send();
    } else {
      Trainer.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/teachers/login');
  }
}

module.exports = router;
