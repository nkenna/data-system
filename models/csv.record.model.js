var mongoose = require('mongoose');

var csvrecords = mongoose.Schema({
  pf: String,
  event: String,
  time: Date,
  
  
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('CsvRecords', csvrecords);