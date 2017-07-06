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
app.use(bodyParser.urlencoded({ extended: true }));

// validation
app.use(expressValidator());

// app.use('/user', userRouter);

// // create LIKE instance
// const like = models.like.build({
//    status: true,
//    postId: 4
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
   // console.log("SESSION TEST: " + req.session.gabberId);
   models.post.findAll().then(function(posts) {
      res.render('gabbleGaggle', {posts: posts})
   });
});


// app.post('/like', function (req,res) {
//    console.log(req.body.name);
   // console.log(req.body[5]);
   // var likePostId = req.body[1];
   // const like = models.like.build({
   //       status: true,
   //       postId: likePostId
   // });
   //
   // like.save().then(function (newLike) {
   //    console.log(newLike);
   // });


});
// app.post('/like', function (req,res) {
//    // like instance
//
//    // const like = models.like.build({
//    //    status: true,
//    //    postId:
//    // });
//    //
//    // like.save().then(function (newLike) {
//    //    console.log(newLike);
//    // });
// })

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
