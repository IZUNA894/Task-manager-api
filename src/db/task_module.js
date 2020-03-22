const mongoose = require('mongoose')
const validator = require('validator');
const User = require("./user_module");
var taskSchema=new mongoose.Schema({
  work:
  {
    required:true,
    type:String,
    trim:true

  },
  completed:{
    type:Boolean,
    default:false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectID,
    required:true,
    ref:'User'
  }

},
{
  timestamps:true
});
var Task= mongoose.model('Task' , taskSchema);
module.exports = Task;
