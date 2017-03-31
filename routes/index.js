const express = require('express');
const router = express.Router();
const typograf = require('node-artlebedev-typograf');
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Я — Виктор Колб'});
});

const PostSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  posted: {type: Date, default: Date.now}
}, {collection: 'post'});

const PostModel = mongoose.model('PostModel', PostSchema)

router.get('/blog', function(req, res) {

  PostModel.find().then(
    post_obj => res.render('blog', {title: 'Блог', posts: post_obj || []}),
    error => res.sendStatus(400)
  );

});

router.get('/createpost', function(req, res) {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('createpost', {title: 'Блог', user: req.session.user});
  }
});

router.get('/toheaven', function(req, res) {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('toheaven');
  }
});

router.post('/createpost', function(req, res) {
  const post = req.body;

  PostModel.create(post).then(
    post_obj => res.json(200),
    error => res.sendStatus(400)
  );
});

module.exports = router;
