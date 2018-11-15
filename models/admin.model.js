var mongoose = require('mongoose');

var admin = mongoose.Schema({
  username: String,
  password: String,
  role: String,
  created_date: {type: Date, default: Date.now()},
  updated_date: Date,
  PF: String,
  createdby: String

    
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Admin', admin);