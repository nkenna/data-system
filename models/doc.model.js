var mongoose = require('mongoose');

var doc = mongoose.Schema({
  PF: String,
  ID: String,
  note: String,
  title: String,
  created_date: {type: Date, default: Date.now()},
  updated_date: Date,
  uploadedby: String,
  updatedby: String,
  contentType: String,
  link: String
    
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Doc', doc);