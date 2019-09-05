const express = require ("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
// const multer = require('multer');

mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})

//check for db errors
db.on('error', function(err){
  console.log(err);
});

//init app
const app = express();

//Bring in Models
let Article = require('./models/article');
let Trainer = require('./models/trainer');

//setup ejs
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}))
//parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg : msg,
    value : value
  };
}
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//home route
app.get("/", function(req, res){
  Article.find({}, function(err, articles){
    if (err) {
      console.log(err);
    }else {
      res.render("index", {
        title: 'Fitnesscenter and Trainer',
        articles: articles,
      });
    }
  });
});

app.get("/trainer_list", function(req, res){
  Trainer.find({}, function(err, trainers){
    if (err) {
      console.log(err);
    }else {
      res.render("trainer_list", {
        title: 'Trainer',
        trainers: trainers
      });
    }
  });
});

//Route files
let articles = require('./routes/articles');
let trainers = require('./routes/trainers');
let teachers = require('./routes/teachers');
app.use('/articles', articles);
app.use('/trainers', trainers);
app.use('/teachers', teachers);

//404 route
app.get("*", function(req, res){
  res.render("error", {
    title: '404'
  });
});

app.listen("3000", function(){
  console.log("Server is running on port: '3000'");
});
