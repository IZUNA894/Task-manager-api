const mongoose = require('mongoose')
const validator = require('validator');

var Task= mongoose.model('Task' , {
  work:
  {
    required:true,
    type:String,
    trim:true

  },
  completed:{
    type:Boolean,
    default:false
  }

});
module.exports = Task;
