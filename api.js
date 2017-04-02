const mongoose = require('mongoose');
const crypto = require('crypto');
const UserModel = require('./models/User.js');
const PostModel = require('./models/Post.js');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/victorkolb");

// User API

// exports.createUser = function(userData) {
//   console.log(userData)
//   const user = {
//     username: userData.username,
//     password: hash(userData.password)
//   };
//   return new UserModel(user).save()
// };

exports.getUser = function(id) {
  return UserModel.findOne(id)
};

exports.getAllPosts = () => {
  return PostModel.find()
    .then(posts => Promise.resolve(posts))
    .catch(error => Promise.reject("Не получилось"));
};

exports.createBlogPost = (post) => {
  return PostModel.create(post)
    .then(post => Promise.resolve(post))
    .catch(error => Promise.reject("Не получилось"));
};

exports.checkUser = function(userData) {
  return UserModel
    .findOne({username: userData.username})
    .then(function(doc) {
      if (doc.password == hash(userData.password)) {
        console.log("User password is ok");
        return Promise.resolve(doc)
      } else {
        console.log("User password is не ok");
        return Promise.reject("Error wrong")
      }
    })
};

function hash(text) {
  return crypto.createHash('sha1')
    .update(text).digest('base64')
}