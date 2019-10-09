var validator= require('validator');
var mongoose= require('mongoose');
module.exports =
  mongoose.model('Users', {
      name: {
        required:true,
        type:String,
        trim:true,
      },
      age:{
        type:Number,
        default:10,
        required:true,
        min:0,

      } ,
    email:{
      type:String,
      required:true,
      trim:true,
      lowercase:true,
      validate(value){
        if(!validator.isEmail(value))
        throw "error:is not email";
      }
    },
    password:{
      type:String,
      trim:true,
      minlength:8,
      required:true
    } });
