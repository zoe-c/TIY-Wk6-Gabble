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
// const authenticate = require('./auth.js');

// app
const app= express();

// views
app.engine('mustache', mustacheExpress());
app.set('views', './views');
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

// work on auth code/ validation for login
//auth function
// function authenticate(req, username, password) {
//    // console.log('authenticating');
//    var authenticatedUser = models.gabber.findOne().then(function(gabber){
//       console.log(gabber);
//     if (username === gabber.username && password === gabber.password) {
//       return req.session.authenticated = true;
//       console.log('User and Password Authenticated!');
//     } else {
//       console.log('Unauthorized!');
//       return req.session.autheticated = false;
//       // res.redirect('/login');
//      }
//    });
//    console.log(req.session);
//    return req.session;
// }


// test to see if post and user connect
// models.Posts.findOne({
//    include: [{
//       model:models.user,
//       as:'user'
//    }].then(function(Posts){
//       console.log(Posts);
//    })
// });

// create GABBER instance
// const gabber = models.gabber.build({
//    username: 'John',
//    password: 'jpassword'
// });
//
// gabber.save().then(function (newGabber) {
//   console.log(newGabber);
//   console.log(newGabber.id);
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


 // work on auth code/ validation for login
// app.post('/login', function (req, res){
//    let username = req.body.username;
//    let password = req.body.password;
//    // console.log(username);
//    // console.log(password);
//    if (username === models.gabber.username && password === models.gabber.password){
//       console.log(models.gabber.username);
//       console.log("Authenticated GABBER")
//    };
//    res.end();
//    //
//    // authenticate(req, username, password);
//    // if (req.session && req.session.authenticated) {
//    //       // console.log("you are authenticated!");
//    //       // res.render('index', {username : username})
//    //       console.log('Authenticated User ' + username)
//    //    } else {
//    //       console.log('Unauthorized!')
//    //       res.redirect('/');
//    //    };
// })


// successful render test for "gabbers"// "users"
// app.get('/userList', function (req,res) {
//    models.gabber.findAll().then(function(gabbers){
//       res.render('userList', {gabbers: gabbers});
//    });
// });

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

app.get('userHome/:username', function(req,res){
   let username = req.body.username;
   console.log(username);
})



app.listen(3000, function() {
   console.log('Listening on port 3000!');
});
