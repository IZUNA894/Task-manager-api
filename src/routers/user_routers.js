var express = require("express");
var multer = require('multer');
var router = express.Router();
var User= require('../db/user_module');
var Task =require('../db/task_module');
var sharp = require("sharp");
var auth = require('../middelware/auth_ware');
var emailutil = require('../../email');
// uploading a profile pic
var upload=multer({
  limits:
  {
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
      return cb(new Error("Please upload a jpg img"));
    }
    cb(undefined,true);
  }
});
router.post('/users/me/avatar',auth,upload.single("avatar"), async function(req,res)
{
   var buffer = await sharp(req.file.buffer).resize({
     width:250,
     height:250
   }).png().toBuffer();
   req.user.avatar= buffer;
   await req.user.save();
   res.send("uploaded");

},(err,req,res,next)=>{
  //console.log(err.message);
  res.status(400).send({error:err.message});
});


// deleting a profile pic
router.delete('/users/me/avatar',auth, async function(req,res)
{
   req.user.avatar= undefined;
   await req.user.save();
   res.send("deleted");

},(err,req,res,next)=>{
  res.status(400).send({error:err.message});
});


// getting a avatar
router.get('/users/me/avatar',async function(req,res)
{
   res.set("Content-Type","image/jpg");
   var user = await User.findById("5db71379e308cb343441695c");
   // var avatar = user.avatar;
   // console.log(user.avatar);
   res.send(user.avatar);

},(err,req,res,next)=>{
  res.status(400).send({error:err.message});
});


// getting a user profile...
router.get('/users/me',auth, async function(req,res)
{
   // try
   //   {
   //
   //   //var users = await User.find({});
   //   res.send(req.user);
   // } catch (e) {
   //   res.status(400).send(e);

   // }
   await  req.user.populate("tasks").execPopulate();
   //console.log( req.user.tasks)
   res.send(req.user);

});


//getting user by id
// router.get('/users/:id',async function(req,res){
//   try{
//     var users = await User.findById(req.params.id);
//     if(!users)
//     {
//       throw new Error("cant find any users with given id ");
//     }
//     res.send(users);
//   }
//   catch(e){
//     res.send(e);
//   }
//
// });


// updating user
router.patch("/users/me" , auth ,async (req, res ) =>{
 var allowedUpdates = ["name", "email", "password","age"];
 var updates = Object.keys(req.body);
 var isValidOperation = updates.every( (item)=> allowedUpdates.includes(item))
 if(!isValidOperation)
 res.status(400).send("ERROR:cant find the property you requested ");
 try{
    var user = req.user;
     updates.forEach((key)=>{user[key] = req.body[key]});
    await user.save();
   //var user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
   if(!user)
   res.status(400).send("error");

   res.status(200).send(user);
 }
 catch(e){
   res.status(400).send(e);
 }
});


//delting user
router.delete("/users/me" ,auth,  async (req,res) =>{
try{
  var user = req.user;
  await user.remove();
  await Task.deleteMany({owner:user._id});
  emailutil.sendmail(user.email,"welcome to my new app","please share your experience");
  res.send(req.user);
}
catch(e)
{
  res.status(400).send(e);
}
})


//creating a new user
router.post('/users', async function(req,res){
 try{
   var user = new User(req.body);
   var user = await user.save();
   var token = await user.getAuthToken();
  // emailutil.sendmail(user.email,"welcome to my new app","please share your experience");

   res.status(201).send({user,token});
 }catch(e)
  {
    console.log(e);
    res.status(400).send("error");
  }

});

//login a user
router.post('/users/login', async function(req,res){
 try{
   var user = await User.findByCredentials(req.body.email,req.body.password);
   //console.log(req.body.password);
   //console.log(user);

   if(!user){
   throw new Error("unable to login");
   }
   var token = await user.getAuthToken();

   res.status(200).send({user,token});
 }
  catch(e)
  {
    //console.log(e);
    res.status(400).send("unable to login");
  }

});

//log out user
router.post("/users/logout",auth, async function(req,res){
  try{
    req.user.tokens = req.user.tokens.filter((token_obj)=>{
      return token_obj.token !==req.token;
    })
    await req.user.save();
    res.status(200).send("logout out successfully");
  }
  catch(e)
  {
    res.status(500).send(e);
  }
} );


//logout from alll devices
router.post("/users/logoutALL",auth, async function(req,res){
  try{
    req.user.tokens = req.user.tokens.filter((token_obj)=>{
      return 0;
    })
    await req.user.save();
    res.status(200).send("logout out successfully");
  }
  catch(e)
  {
    res.status(500).send(e);
  }
} );


module.exports= router;
