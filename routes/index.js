const express = require('express');
const router = express.Router();
const typograf = require('node-artlebedev-typograf');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Я — Виктор Колб'});
});

router.get('/userlist', function (req, res) {
  const db = req.db;
  const collection = db.get('usercollection');
  collection.find({}, {}, (e, docs) => {
    res.render('userlist', {
      "userlist": docs
    });
  });
});

router.get('/newuser', function (req, res) {
  res.render('newuser', {title: 'Add New User'});
});


router.post('/adduser', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
    "username": userName,
    "email": userEmail
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("userlist");
    }
  });
});

router.get('/blog', function (req, res) {
  res.render('blog', {title: 'Блог'});
});

module.exports = router;
