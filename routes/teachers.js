const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//Init Upload
const upload = multer({
  storage : storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

//Check File Type
function checkFileType(file, cb) {
  //Allow ext
  const filetypes = /jpeg|jpg|png/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);
}

//Bring in Teacher Model
let Teacher = require('../models/teacher');

//Registration form
router.get('/register', function(req, res){
  res.render('register');
});

//Registration Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Name is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors:errors
    });
  } else {
    let newTeacher = new Teacher({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newTeacher.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        newTeacher.password = hash;
        newTeacher.save(function(err){
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'You are now registered');
            res.redirect('/teachers/login');
          }
        });
      });
    });
  }
});

//Login form
router.get('/login', function(req, res){
  res.render('login');
});

//Login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/teachers/login',
    failureFlash: true
  })(req, res, next);
});

//Login form
router.get('/profile', function(req, res){
  res.render('teachers/teacher_profile');
});

//profile route
router.post('/add_photo', function(req, res){
  upload(req, res, (err) => {
    // if (err) {
    //   res.render('teachers/teacher_profile', {
    //     msg: err
    //   });
    // } else {
      console.log(req.file);
      res.send('test');
    // }
  });
});

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/teachers/login');
});


module.exports = router;
