const express = require('express');
const router = express.Router();
const api = require('../api.js');

function isAuthenticated(req, res, next) {

  if (req.session.user)
    return next();

  res.redirect('/login');
}

router.get('/', function(req, res) {
  api.getAllPosts()
    .then(posts => {
      res.render('blog',
        {
          title: 'Виктор Колб. Блог',
          posts: formatDate(posts).reverse(),
          admin: req.session.user
        });
    })
    .catch((error) => console.log(error));
});

router.post('/createpost', isAuthenticated, function(req, res) {
  api.createBlogPost(req.body).then(res.redirect('/blog')).catch(error => res.json(res));
});

router.get('/createpost', function(req, res) {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('createpost', {title: 'Блог', user: req.session.user});
  }
});

router.get('/edit/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    api.getPost(req.params.id)
      .then(post => {
        res.render('editpost',
          {
            title: 'Редактировать запись',
            post: post,
          });
      })
      .catch((error) => console.log(error));
  }
});


router.post('/edit/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    api.editPost(req.params.id, req.body)
      .then(() => {
        res.redirect('/blog')
      })
      .catch((error) => console.log(error));
  }
});

router.get('/delete/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  else {
    api.deletePost(req.params.id)
      .then(() => {
        res.redirect('/blog')
      })
      .catch((error) => console.log(error));
  }
});

function formatDate(posts) {
  posts.forEach(post => {
    post.posted_formatted = `${post.posted.getDate()}.${post.posted.getMonth()}.${post.posted.getFullYear()}`;
  });

  return posts;
}

module.exports = router;