// successful render test for "gabbers"// "users"
// app.get('/userList', function (req,res) {
//    models.gabber.findAll().then(function(gabbers){
//       res.render('userList', {gabbers: gabbers});
//    });
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

// // create LIKE instance
// const like = models.like.build({
//    status: true,
//    postId: 1
// });
//
// like.save().then(function (newLike) {
//    console.log(newLike);
// });




// function for grabbing post id 









//-----------------------------THOMAS' EXAMPLE
// app.use(session){
//    codeblock of stuff that goes in your session.
//    secret, maxage etc
// }

// MAKE SURE YOUR SESSION IS CREATED BEFORE YOUR ROUTES!!
// BEFORE YOUR VALIDATOR, BEFORE PARSER, BEFORE ROUTER. (he has it right underneath the views)
