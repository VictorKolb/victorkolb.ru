const express = require('express');
const router = express.Router();
const typograf = require('node-artlebedev-typograf');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Я — Виктор Колб'});
});


router.get('/toheaven', function(req, res) {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('toheaven');
  }
});

router.get('/newuser', function(req, res) {
    res.render('newuser');
});

module.exports = router;
