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
app.set('views', ['./views', './views/user']);
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
   res.render('index');
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
      res.redirect('/userHome/');
    } else {
      req.session.authenticated = false;
      console.log('unauthorized!');
      res.redirect('/');
    }
  })
  return req.session;
});

//------------------------------------------------------------------

// link to sign up page. login is on root.
app.post('/to-signUp', function (req,res) {
   res.redirect('/signUp');
});

// render sign up form
app.get('/signUp', function (req,res) {
   res.render('signUp');
});

app.post('/signUp', function (req, res) {
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
// --------------------------------------
// link to login page. currently only on signUp
app.post('/to-login', function (req,res) {
   res.redirect('/');
});

// -------------------------------------------------------------
app.get('/userHome/', function (req,res) {
   res.render('userHome', {username: req.session.username})
});

// -------------------------------------------------------------
app.post('/postToGaggle', function (req, res) {
   const post = models.post.build({
      title: req.body.gabTitle,
      body: req.body.gabBody,
      gabberId: req.session.gabberId
   })
   post.save().then(function (newPost) {
      console.log(newPost);
      res.redirect('/gaggle/');
   });
});
// ------------------------------------------------------------
app.get('/gaggle/', function (req,res) {
   // IDEA: add link around title to switch to a solo page of this post,
   // on that page, you will list the names of who all liked that post
   models.post.findAll({
      order: [['id', 'DESC']],
      include: [
         {
            model: models.gabber,
            as: 'gabber'
         }
      ]
   }).then(function(posts) {
      res.render('gabbleGaggle', {posts: posts})
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
   res.redirect('/gaggle/');
});

// -----------------------------------------------------
 app.get('/likedBy', function (req,res) {
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
      ]
      // THIS IS RENDERING ALL LIKES ASSOCIATED WITH THE SAME POST SEPERATELY.
   }).then(function(likes) {
      console.log(likes);
      res.render('likedBy', {likes: likes})
    });

});

// -----------------------------------------------------------
// adding delete feature
app.get('/your-gabs/', function (req,res) {
   models.post.findAll({
      where: {
         gabberId: req.session.gabberId
      }
   }).then(function(posts) {
      res.render('yourPosts', {posts: posts})
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
         res.redirect('/your-gabs/'));

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
