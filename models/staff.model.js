var mongoose = require('mongoose');

var staff = mongoose.Schema({
  firstname: String,
  middlename: String,
  lastname: String,
  PF: String,
  unit: String,
  sex: String,
  origin: String,
  lga: String,
  mobile1: String,
  mobile2: String,
  email: String,
  kin: String,
  kin_mobile: String,
  birth_date: Date,
  employment_date: Date,
  department: String,
  level: String,
  created_date: {type: Date, default: Date.now()},
  updated_date: Date,
  contenttype: String,
  mediafile: String,
  created_by: String

    
});

// create the model for elections and expose it to our app
module.exports = mongoose.model('Staff', staff);