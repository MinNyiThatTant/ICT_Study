const express = require('express');
const multer = require('multer');
const router = express.Router();

//Article Model
let Article = require('../models/article');

const upload = multer({ dest: 'public/uploads/'});
//Teacher Model
let Teacher = require('../models/teacher');



//edit single article
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Article.findById(req.params.id, function(err, article){
    if (article.author != req.user._id) {
      req.flash('danger', 'Not Authorized !');
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Fitnesscenter',
      article: article,
    });
  });
});

//teacher route
router.get("/add", ensureAuthenticated, function(req, res){
  res.render("add_article", {
    title: 'Add Fitnesscenter'
  });
});

// category route
router.get('/category1', function(req, res){
  Article.find({category: 'bogalay'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Bogalay',
        articles: articles
      });
    }
  })
});
router.get('/category2', function(req, res){
  Article.find({category: 'danubyu'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Danubyu',
        articles: articles
      });
    }
  })
});
router.get('/category3', function(req, res){
  Article.find({category: 'dedaye'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Dedaye',
        articles: articles
      });
    }
  })
});
router.get('/category4', function(req, res){
  Article.find({category: 'einme'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Einme',
        articles: articles
      });
    }
  })
});
router.get('/category5', function(req, res){
  Article.find({category: 'hinthada'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Hinthada',
        articles: articles
      });
    }
  })
});
router.get('/category6', function(req, res){
  Article.find({category: 'kyaunggone'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Kyaunggone',
        articles: articles
      });
    }
  })
});
router.get('/category7', function(req, res){
  Article.find({category: 'kyonpyaw'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Kyonpyaw',
        articles: articles
      });
    }
  })
});
router.get('/category8', function(req, res){
  Article.find({category: 'maubin'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Ma-ubin',
        articles: articles
      });
    }
  })
});
router.get('/category9', function(req, res){
  Article.find({category: 'myanaung'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Myanaung',
        articles: articles
      });
    }
  })
});
router.get('/category10', function(req, res){
  Article.find({category: 'myaungmya'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Myaungmya',
        articles: articles
      });
    }
  })
});
router.get('/category11', function(req, res){
  Article.find({category: 'pantanaw'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Pantanaw',
        articles: articles
      });
    }
  })
});
router.get('/category12', function(req, res){
  Article.find({category: 'pathein'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Pathein',
        articles: articles
      });
    }
  })
});
router.get('/category13', function(req, res){
  Article.find({category: 'wakema'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Wakema',
        articles: articles
      });
    }
  })
});
router.get('/category14', function(req, res){
  Article.find({category: 'zalun'}, function(err, articles){
    if(err){
      console.log(err);
    }else {
      res.render('category', {
        title: 'Zalun',
        articles: articles
      });
    }
  })
});
//add submit post route
router.post('/add', upload.single('photo'), function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('otinfo', 'Other info is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_article', {
      title: 'Add Fitnesscenter',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.category = req.body.category;
    article.address = req.body.address;
    article.phone = req.body.phone;
    article.opttime = req.body.opttime;
    article.closetime = req.body.closetime;
    article.memberfeed = req.body.memberfeed;
    if(req.file) article.photo = '/uploads/' + req.file.filename;
    article.classes = req.body.classes;
    article.author = req.user._id;
    article.otinfo = req.body.otinfo;
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else {
        req.flash('success','Fitnesscenter Added');
        res.redirect('/');
      }
    });
  }
});

//get single article
router.get('/:id', function (req, res) {
  Article.findById(req.params.id, function(err, article){
    Teacher.findById(article.author, function(err, teacher){
      res.render('article', {
        article: article,
        author: teacher.name
      });
    });
  });
});

//update submit post route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.category = req.body.category;
  article.address = req.body.address;
  article.phone = req.body.phone;
  article.opttime = req.body.opttime;
  article.closetime = req.body.closetime;
  article.memberfeed = req.body.memberfeed;
  article.classes = req.body.classes;
  article.otinfo = req.body.otinfo;
  article.author = req.user._id;
  let query = {_id:req.params.id}
  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else {
      req.flash('success', 'Fitnesscenter Updated');
      res.redirect('/');
    }
  });
});

//Delete route
router.delete('/:id', function(req, res){
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/teachers/login');
  }
}

module.exports = router;
