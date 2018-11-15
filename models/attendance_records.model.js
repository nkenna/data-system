var mongoose = require('mongoose');

var records = mongoose.Schema({
  name: String,
  pf: String,
  unit: String,
  event: String,
  status: String,
  time: Date,
  
  
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Records', records);