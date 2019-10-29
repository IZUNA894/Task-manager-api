var express = require("express");
var multer = require('multer');
var router = express.Router();
var User= require('../db/user_module');
var Task =require('../db/task_module');

var auth = require('../middelware/auth_ware');

// getting a profile pic
var upload=multer({
  dest:"images"
});
router.post('/users/me/avatar',upload.single("upload"), async function(req,res)
{

   res.send("uploaded");

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
   console.log( req.user.tasks)
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
   res.status(400).send("error")

   res.send(user);
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

   res.send({user,token});
 }catch(e)
  {
    console.log("helllo ji");
    res.status(400).send("error");
  }

});

//login a user
router.post('/users/login', async function(req,res){
 try{
   var user = await User.findByCredentials(req.body.email,req.body.password);
   if(!user){
     //console.log("hey ya");
   throw new Error("unable to login");
   }
   var token = await user.getAuthToken();

   res.send({user,token});
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
