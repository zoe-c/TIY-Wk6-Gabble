// let username = req.body.username;
//   let password = req.body.password;
//
//   models.user.findOne({
//     where: {
//       username: username
//     }
//   }).then(user => {
//     if (user.password == password) {
//       req.session.username = username;
//       req.session.authenticated = true;
//       res.redirect('/');
//     } else {
//       res.redirect('/login');
//     }
//   })
// })
