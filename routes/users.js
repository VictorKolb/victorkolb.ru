const express = require('express');
const router = express.Router();
const api = require('../api.js');

/* Создание пользователя */
router.post('/login', function(req, res, next) {
  if (req.session.username) return res.json('Logged');

  api.checkUser(req.body)
    .then(function(user) {
      if (user) {
        req.session.user = {id: user._id, username: user.username};
        console.log('session:', req.session)
        return res.redirect('/')
      } else {
        return next(error)
      }
    })
    .catch(function(error) {
      return next(error)
    })

});

// router.post('/create', function(req, res, next) {
//   api.createUser(req.body)
//     .then(function(result) {
//       console.log("User created")
//     })
//     .catch(function(err) {
//       console.log(err)
//     })
// });

router.post('/logout', function(req, res, next) {
  if (req.session.user) {
    delete req.session.user;
    res.redirect('/')
  }
});

module.exports = router;