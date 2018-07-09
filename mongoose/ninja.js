var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

const EntrySchema  = new Schema({
  name : {
    type : String ,
    required : [true , 'name is required']
  } ,
  password : {
    type : String ,
    required : [true , 'password is required']
  }
});

const Entry = mongoose.model('entry' , EntrySchema);

module.exports = Entry;
