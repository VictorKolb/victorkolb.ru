const express = require('express');
const router = express.Router();
const api = require('../api.js');

router.get('/', function(req, res) {
  api.getAllPosts()
    .then(posts => {
      res.render('blog', {title: 'Виктор Колб. Блог', posts: formatDate(posts).reverse()});
    })
    .catch((error) => console.log(error));
});

router.post('/createpost', function(req, res) {
  api.createBlogPost(req.body).then(res.redirect('/')).catch(error => res.json(res));
});

router.get('/createpost', function(req, res) {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('createpost', {title: 'Блог', user: req.session.user});
  }
});

function formatDate(posts) {
  posts.forEach(post => {
    post.posted_formatted = `${post.posted.getDate()}.${post.posted.getMonth()}.${post.posted.getFullYear()}`
  });

  return posts;
}

module.exports = router;