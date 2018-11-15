var mongoose = require('mongoose');

var leave = mongoose.Schema({
  PF: String,
  leave_type: String,
  leave_start_date: Date,
  leave_end_date: Date,
  created_date: {type: Date, default: Date.now()},
  updated_date: Date,
  title: String,
  createdby: String,
  updatedby: String
    
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Leave', leave);