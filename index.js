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

// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
//   }).catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


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

app.get('/userList', function (req,res) {
   models.gabber.findAll().then(function(gabbers){
      res.render('userList', {gabbers: gabbers});
   });
});

app.post('/to-signUp', function (req,res) {
   res.redirect('/signUp');
});

app.get('/signUp', function (req,res) {
   res.render('signUp');
});

app.listen(3000, function(){
   console.log('Listening on port 3000!');
});
