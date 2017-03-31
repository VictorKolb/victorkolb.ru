const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/User.js');

mongoose.Promise = global.Promise;
const db = mongoose.connect("mongodb://localhost/victorkolb");

// User API

exports.createUser = function(userData) {
  const user = {
    username: userData.username,
    password: hash(userData.password)
  };
  console.log(user)
  return new User(user).save()
};

exports.getUser = function(id) {
  return User.findOne(id)
};

exports.checkUser = function(userData) {
  return User
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