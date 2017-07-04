// const express = require('express')
// const router = express.Router()
// const models = require("../models")
// const session = require('express-session')
//
// // sessions
// router.use(session({
//   secret: 'ssshhh',
//   resave: false,
//   saveUninitialized: true
// }));
//
//
// router.post('/login', function(req, res) {
//   let username = req.body.username;
//   let password = req.body.password;
//
//   models.gabber.findOne({
//     where: {
//       username: username
//     }
// }).then(gabber => {
//     if (gabber.password == password) {
//       req.session.username = username;
//       req.session.authenticated = true;
//       console.log('Match ' + gabber.id);
//       res.redirect('/user');
//     } else {
//       req.session.authenticated = false
//       res.redirect('/');
//     }
//   })
// });
//
// router.get('/user', function (req, res){
//    res.render('userHome');
// });





module.exports = router
