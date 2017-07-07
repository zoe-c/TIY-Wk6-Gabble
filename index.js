const express = require('express');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const path = require('path');
const session = require('express-session');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
// -----------------------
const sequelize = require('sequelize');
const models = require("./models");
// likefunction is linked properly, do not delete
// const getTriggers = require('./likeFunction.js')

// const userRouter = require('./routes/user')
// const authenticate = require('./auth.js');

// app
const app= express();

// views
app.engine('mustache', mustacheExpress());
app.set('views', ['./views', './views/user']);
app.set('view engine', 'mustache');

// Thomas* advice>> SESSIONS HERE ABOVE routes
// sessions
app.use(session({
  secret: 'ssshhh',
  resave: false,
  saveUninitialized: true
  // username: '';
  // gabberId: '';

}));


// styles
app.use(express.static('public'));


// parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// validation
app.use(expressValidator());

// app.use('/user', userRouter);

// // create LIKE instance
// const like = models.like.build({
//    status: true,
//    postId: 4,
//    gabberId: 3
// });
//
// like.save().then(function (newLike) {
//    console.log(newLike);
// });

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
  // console.log(req.session);
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
         // res.send("new gabber added!")
         // res.redirect('/userHome/:username');
});

// -------------------------------------------------------------
app.get('/userHome/', function (req,res) {
   // console.log("SESSION TEST: " + req.session.gabberId);
   res.render('userHome', {username: req.session.username})
});

// -------------------------------------------------------------
app.post('/postToGaggle', function (req, res) {
   // console.log(req.session.gabberId);
   const post = models.post.build({
      title: req.body.gabTitle,
      body: req.body.gabBody,
      gabberId: req.session.gabberId
      // need to pull out username instead
   })
   post.save().then(function (newPost) {
      // req.session.postId = newPost.id;
      // console.log("POST ID STORED IN SESSION : " + req.session.postId )
      console.log(newPost);
      res.redirect('/gaggle/');
   });
});
// ------------------------------------------------------------
app.get('/gaggle/', function (req,res) {
   // NEED: add like count to posts
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
   // console.log(req.body.likeButton);
   const like = models.like.build({
         status: true,
         postId: req.body.likeButton,
         gabberId: req.session.gabberId
   });
   // if they've already liked the post, do not save it.
   // models.like.findAll().then(
   like.save().then(function (newLike) {
      console.log(newLike);
   });
   // eventually, alert that they liked the post and then send them back to the gaggle.
   // add link to view likes
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
      // ASK HOW TO ORDER THIS OR RENDER THIS BY THE POST COLLECTING ALL THE LIKES ASSOCIATED WITH IT, INSTEAD OF MY THE LIKES.
      // THIS IS RENDERING ALL LIKES ASSOCIATED WITH THE SAME POST SEPERATELY.

      // order: [['id', 'DESC']]
   }).then(function(likes) {
      console.log(likes);
      res.render('likedBy', {likes: likes})
    });


});

// -----------------------------------------------------------
app.post('/logout', function (req,res) {
   req.session.destroy();
   // console.log("bye!")
   res.redirect('/gab-bye');
   // res.redirect('/');
});

app.get('/gab-bye', function (req,res) {
   req.session.destroy();
   res.send('See ya later!');
});

app.listen(3000, function() {
   console.log('Listening on port 3000!');
});
