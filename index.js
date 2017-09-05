const express = require('express');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const path = require('path');
const session = require('express-session');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const pg = require('pg');
// -----------------------
const sequelize = require('sequelize');
const models = require("./models");


// app
const app= express();

// views
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//SESSIONS ABOVE routes
app.use(session({
  secret: 'ssshhh',
  resave: false,
  saveUninitialized: true

}));

// styles
app.use(express.static('public'));

// parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// validation
app.use(expressValidator());

// REQUESTS---------------------------------------------------------
app.get('/', function(req,res){
   res.render('login');
});

app.post('/login', function (req,res){
  let username = req.body.username;
  let password = req.body.password;

  models.gabber.findOne({
    where: {
      username: username,
      password: password
    }
}).then(gabber => {
    if (gabber.password == password && gabber.username == username) {
      req.session.username = username;
      req.session.gabberId = gabber.id;
      req.session.authenticated = true;
      res.redirect('/home');
    } else {
      req.session.authenticated = false;
      console.log('unauthorized!');
      res.redirect('/');
    }
  })
  return req.session;
});

//------------------------------------------------------------------

// render sign up form
app.get('/signup', function (req,res) {
   res.render('signup');
});

app.post('/sign-up', function (req, res) {
   const gabber = models.gabber.build({
      username: req.body.username,
      password: req.body.password1
   });
   gabber.save().then(function(req, res, next){
      console.log(username);
      next();
   });
         res.redirect('/');
});

// -------------------------------------------------------------
app.get('/home', function (req,res) {
   res.render('home', {username: req.session.username})
});

app.get('/gotta-gab', function (req,res) {
   res.render('got-a-gab', {username: req.session.username})
});

// -------------------------------------------------------------
app.post('/post-gab', function (req, res) {
   const post = models.post.build({
      title: req.body.gabTitle,
      body: req.body.gabBody,
      gabberId: req.session.gabberId
   })
   post.save().then(function (newPost) {
      console.log(newPost);
      res.redirect('/community-gabs');
   });
});
// ------------------------------------------------------------
app.get('/community-gabs', function (req,res) {
   models.post.findAll({
      order: [['id', 'DESC']],
      include: [
         {
            model: models.gabber,
            as: 'gabber'
         }
      ]
   }).then(function(posts) {
      res.render('gabble-community', {posts: posts})
   });
});

// like instance test
app.post('/like', function (req,res) {
   const like = models.like.build({
         status: true,
         postId: req.body.likeButton,
         gabberId: req.session.gabberId
   });
   // if they've already liked the post, do not save it. need to add function before the save below.
   like.save().then(function (newLike) {
      console.log(newLike);
   });
   // eventually, alert that they liked the post and then send them back to the gaggle.
   res.redirect('/community-gabs');
});

// -----------------------------------------------------
 app.get('/likes', function (req,res) {
   res.render('liked-by');
});

app.get('/likesGiven', function (req, res) {
  models.like.findAll({
    include: [
       {
          model: models.post,
          as: 'post'
       },
       {
          model: models.gabber,
          as: 'gabber'
       }
    ],
    where: {
       gabberId: req.session.gabberId,
    }
 }).then(function(likes) {
   res.render('liked-by', { likes: likes })
   });
 });

 app.get('/likesRecieved', function (req, res) {
   models.like.findAll({
     include: [
        {
           model: models.post,
           as: 'post'
        },
        {
           model: models.gabber,
           as: 'gabber'
        }
     ],
     where: {
        gabberId: {
          $ne: req.session.gabberId,
        }
     }
  }).then(function(likes) {
    res.render('liked-by', { likes: likes })
    });
  });

// -----------------------------------------------------------
// adding delete feature
app.get('/your-gabs', function (req,res) {
   models.post.findAll({
      where: {
         gabberId: req.session.gabberId
      }
   }).then(function(posts) {
      res.render('your-posts', {posts: posts})
   });
});

app.post('/delete', function(req,res) {
   models.like.destroy({
     where: {
       postId: req.body.deleteButton
     }
  }).then(
    models.post.destroy({
         where: {
            id: req.body.deleteButton
         }
      })).then(
         res.redirect('/your-gabs'));

});
// logout
// ---------------------------------------------------------
app.post('/logout', function (req,res) {
   req.session.destroy();
   res.redirect('/gab-bye');
});

app.get('/gab-bye', function (req,res) {
   req.session.destroy();
   res.send('See ya later!');
});
// ----------------------------------------------------------
app.listen(process.env.PORT || 3000, function() {
   console.log("success!")
});

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
// app.listen(3000, function() {
//    console.log('Listening on port 3000!');
// });
