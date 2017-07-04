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
// const userRouter = require('./routes/user')
// const authenticate = require('./auth.js');

// app
const app= express();

// views
app.engine('mustache', mustacheExpress());
app.set('views', ['./views', './views/user']);
app.set('view engine', 'mustache');

// styles
app.use(express.static('public'));


// parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// validation
app.use(expressValidator());

// sessions
app.use(session({
  secret: 'ssshhh',
  resave: false,
  saveUninitialized: true
}));

// app.use('/user', userRouter);

// test to see if post and user connect
// models.Posts.findOne({
//    include: [{
//       model:models.user,
//       as:'user'
//    }].then(function(Posts){
//       console.log(Posts);
//    })
// });

// create POST instance
// const post = models.post.build({
//    title: 'test post title',
//    body: 'test post body',
//    gabberId: 3
// });
//
// post.save().then(function (newPost) {
//    console.log(newPost);
// });




app.get('/', function(req,res){
   res.render('index');
});

app.post('/login', function (req,res){
  let username = req.body.username;
  let password = req.body.password;

  models.gabber.findOne({
    where: {
      username: username
    }
}).then(gabber => {
    if (gabber.password == password) {
      req.session.username = username;
      req.session.authenticated = true;
      res.redirect('/userHome');
    } else {
      req.session.authenticated = false;
      console.log('unauthorized!');
      res.redirect('/');
    }
  })
  console.log(req.session);
  return req.session;
});

app.get('/userHome', function (req,res) {
   // console.log(req.session);
   res.render('userHome')
});

// link to sign up page. login is on root.
app.post('/to-signUp', function (req,res) {
   res.redirect('/signUp');
});

// render sign up form
app.get('/signUp', function (req,res) {
   res.render('signUp');
});

// add user to "gabbers" upon sign up. log username/ pw
app.post('/signUp', function (req, res) {
   const gabber = models.gabber.build({
      username: req.body.username,
      password: req.body.password1
   });
   gabber.save().then(function(req, res, next){
      console.log(username);
      next();
   });
         // res.redirect('/');
         res.send("new gabber added!")
         // res.redirect('/userHome/:username');
});

app.listen(3000, function() {
   console.log('Listening on port 3000!');
});
