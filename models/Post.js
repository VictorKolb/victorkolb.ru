const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  posted: {type: Date, default: new Date}
}, {collection: 'post'});

module.exports = mongoose.model('PostModel', PostSchema);