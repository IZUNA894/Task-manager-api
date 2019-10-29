var jwt = require("jsonwebtoken");
var User = require("../db/user_module");

 async function  auth(req,res,next){
   try{
   var token =   req.header("Authorization").replace("Bearer ","");
   var decoded = jwt.verify(token,"secretkey");
   var user =    await  User.findOne({_id:decoded._id,"tokens.token":token});
   if(!user)
   {
     throw new Error("please authenticiate again");
   }
   else{
     req.token= token;
     req.user = user;
     next();

   }
 }
 catch(e)
 {
   res.status(401).send("please authenticiate again");
 }

 }
 module.exports = auth;
