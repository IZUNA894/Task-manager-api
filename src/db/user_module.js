var validator= require('validator');
var mongoose= require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
const Task = require("./task_module");
var userSchema  = new mongoose.Schema({
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
  },
  tokens:[
    {
      token:{
        required:true,
        type:String
      }
    }
  ],
  avatar:{
    type:Buffer
  }
},
{
  timestamps:true
} );

//a virtual field..
// to show tasks against his user
  userSchema.virtual("tasks",{
    ref:'Task',
    localField:"_id",
    foreignField:"owner"
  });

//function to hashd the password before save
  userSchema.pre('save' , async function(next){
    var user = this;

    
    var hashedPass ="";
    if(user.isModified('password'))
    {
     hashedPass =  await bcrypt.hash(user.password,8);
    //console.log(hashedPass);
    user.password =hashedPass;
  }


  next();
});



//function to get a jwt token
userSchema.methods.getAuthToken = async function(){
  var user = this;
  var token = await jwt.sign({_id:user._id.toString()},"secretkey");
   user.tokens= user.tokens.concat({token});
  await user.save();
  return token;

}

userSchema.methods.toJSON = function (){
  var user= this;
  user = user.toObject();
  delete user.tokens;
  delete user.password;
  delete user.__v;
  delete user.avatar;
  //console.log(user);
  return user;
}

//this function is called at time of login
  userSchema.statics.findByCredentials = async (email,password) =>
  {
    var user = await User.findOne({email});
    if(!user){
      // throw new Error("unable to login");
      return undefined;
    }
    var isFound = bcrypt.compare(password,user.password);
    //console.log("value of is found"+ JSON.stringify(isFound));
    if(!isFound){
      console.log("error thrrownnnnn");
      throw new Error("unable to login");
    }
    return user
  }

  var User = mongoose.model('Users', userSchema);
  module.exports =User;
