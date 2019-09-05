const LocalStrategy = require('passport-local').Strategy;
const Teacher = require('../models/teacher');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};
    Teacher.findOne(query, function(err, teacher){
      if(err) throw err;
      if(!teacher){
        return done(null, false, {message: 'No Teacher Found'});
      }

      //Match Password
      bcrypt.compare(password, teacher.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, teacher);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(teacher, done) {
    done(null, teacher.id);
  });

  passport.deserializeUser(function(id, done){
    Teacher.findById(id, function(err, teacher){
      done(err, teacher);
    });
  });
}
